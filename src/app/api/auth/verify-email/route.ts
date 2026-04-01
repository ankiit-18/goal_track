import { NextResponse } from "next/server";
import { z } from "zod";
import { attachAuthCookie } from "@/lib/auth-cookie";
import {
  consumeEmailVerificationCode,
  normalizeEmail,
} from "@/lib/auth-email";
import { prisma } from "@/lib/prisma";

const bodySchema = z.object({
  email: z.string().email(),
  code: z.string().trim().regex(/^\d{6}$/, "Enter the 6-digit code"),
});

export async function POST(request: Request) {
  let json: unknown;
  try {
    json = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const parsed = bodySchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.flatten().fieldErrors },
      { status: 400 }
    );
  }

  const email = normalizeEmail(parsed.data.email);
  const user = await prisma.user.findUnique({
    where: { email },
  });

  if (!user) {
    return NextResponse.json(
      { error: "No account was found for this email" },
      { status: 404 }
    );
  }

  // Keep verification idempotent: if a second request arrives after success,
  // return success instead of failing with "No verification code found".
  if (user.emailVerifiedAt) {
    const alreadyVerifiedResponse = NextResponse.json({
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
      },
      alreadyVerified: true,
    });
    return attachAuthCookie(alreadyVerifiedResponse, user.id);
  }

  const result = await consumeEmailVerificationCode({
    email,
    purpose: "SIGNUP",
    code: parsed.data.code,
  });

  if (!result.ok) {
    return NextResponse.json({ error: result.error }, { status: 400 });
  }

  const verifiedUser = await prisma.user.update({
    where: { id: user.id },
    data: { emailVerifiedAt: user.emailVerifiedAt ?? new Date() },
  });

  const response = NextResponse.json({
    user: {
      id: verifiedUser.id,
      email: verifiedUser.email,
      name: verifiedUser.name,
    },
  });

  return attachAuthCookie(response, verifiedUser.id);
}
