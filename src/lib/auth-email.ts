import crypto from "node:crypto";
import { prisma } from "@/lib/prisma";

const CODE_EXPIRY_MINUTES = 10;
const RESEND_COOLDOWN_SECONDS = 60;

function getVerificationSecret() {
  const secret = process.env.EMAIL_CODE_SECRET || process.env.JWT_SECRET;
  if (!secret) {
    throw new Error("EMAIL_CODE_SECRET or JWT_SECRET must be set");
  }
  return secret;
}

export function normalizeEmail(email: string) {
  return email.trim().toLowerCase();
}

export function generateVerificationCode() {
  return String(crypto.randomInt(0, 1_000_000)).padStart(6, "0");
}

export function hashVerificationCode(email: string, code: string) {
  return crypto
    .createHash("sha256")
    .update(`${getVerificationSecret()}:${normalizeEmail(email)}:${code}`)
    .digest("hex");
}

export async function createEmailVerificationCode(input: {
  email: string;
  purpose: string;
  userId?: string | null;
}) {
  const email = normalizeEmail(input.email);
  const existing = await prisma.emailVerificationCode.findFirst({
    where: {
      email,
      purpose: input.purpose,
      consumedAt: null,
      expiresAt: { gt: new Date() },
    },
    orderBy: { createdAt: "desc" },
  });

  if (existing) {
    const secondsSinceCreated = Math.floor(
      (Date.now() - existing.createdAt.getTime()) / 1000
    );
    if (secondsSinceCreated < RESEND_COOLDOWN_SECONDS) {
      return {
        ok: false as const,
        resendAfterSeconds: RESEND_COOLDOWN_SECONDS - secondsSinceCreated,
      };
    }
  }

  await prisma.emailVerificationCode.updateMany({
    where: { email, purpose: input.purpose, consumedAt: null },
    data: { consumedAt: new Date() },
  });

  const code = generateVerificationCode();
  const expiresAt = new Date(Date.now() + CODE_EXPIRY_MINUTES * 60 * 1000);

  await prisma.emailVerificationCode.create({
    data: {
      email,
      purpose: input.purpose,
      userId: input.userId ?? null,
      codeHash: hashVerificationCode(email, code),
      expiresAt,
    },
  });

  return {
    ok: true as const,
    code,
    expiresAt,
  };
}

export async function consumeEmailVerificationCode(input: {
  email: string;
  purpose: string;
  code: string;
}) {
  const email = normalizeEmail(input.email);
  const inputHash = hashVerificationCode(email, input.code);
  const matchingRecord = await prisma.emailVerificationCode.findFirst({
    where: {
      email,
      purpose: input.purpose,
      expiresAt: { gt: new Date() },
      codeHash: inputHash,
    },
    orderBy: { createdAt: "desc" },
  });

  if (matchingRecord) {
    const consumedAt = matchingRecord.consumedAt ?? new Date();
    if (!matchingRecord.consumedAt) {
      await prisma.emailVerificationCode.update({
        where: { id: matchingRecord.id },
        data: { consumedAt },
      });
    }

    return { ok: true as const, userId: matchingRecord.userId, consumedAt };
  }

  const latestUnconsumed = await prisma.emailVerificationCode.findFirst({
    where: {
      email,
      purpose: input.purpose,
      consumedAt: null,
    },
    orderBy: { createdAt: "desc" },
  });

  if (!latestUnconsumed) {
    return { ok: false as const, error: "No verification code found" };
  }

  if (latestUnconsumed.expiresAt.getTime() <= Date.now()) {
    return { ok: false as const, error: "This code has expired" };
  }

  if (inputHash !== latestUnconsumed.codeHash) {
    await prisma.emailVerificationCode.update({
      where: { id: latestUnconsumed.id },
      data: { attemptCount: { increment: 1 } },
    });
    return { ok: false as const, error: "The code you entered is incorrect" };
  }

  const consumedAt = new Date();
  await prisma.emailVerificationCode.update({
    where: { id: latestUnconsumed.id },
    data: { consumedAt },
  });
  return {
    ok: true as const,
    userId: latestUnconsumed.userId,
    consumedAt,
  };
}

export function getResendCooldownSeconds() {
  return RESEND_COOLDOWN_SECONDS;
}
