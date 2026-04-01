import { NextResponse } from "next/server";
import { z } from "zod";
import {
  createEmailVerificationCode,
  normalizeEmail,
} from "@/lib/auth-email";
import { sendVerificationCodeEmail } from "@/lib/email";
import { prisma } from "@/lib/prisma";

const bodySchema = z.object({
  email: z.string().email(),
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
  const user = await prisma.user.findUnique({ where: { email } });

  if (!user) {
    return NextResponse.json(
      { error: "No account was found for this email" },
      { status: 404 }
    );
  }

  if (user.emailVerifiedAt) {
    return NextResponse.json(
      { error: "This email is already verified" },
      { status: 400 }
    );
  }

  const codeResult = await createEmailVerificationCode({
    email,
    purpose: "SIGNUP",
    userId: user.id,
  });

  if (!codeResult.ok) {
    return NextResponse.json(
      {
        error: `Please wait ${codeResult.resendAfterSeconds}s before requesting another code`,
      },
      { status: 429 }
    );
  }

  try {
    await sendVerificationCodeEmail({ email, code: codeResult.code });
  } catch (error) {
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Could not send verification email",
      },
      { status: 500 }
    );
  }

  return NextResponse.json({ ok: true });
}
