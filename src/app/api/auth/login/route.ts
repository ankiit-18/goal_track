import { NextResponse } from "next/server";
import { z } from "zod";
import { attachAuthCookie } from "@/lib/auth-cookie";
import { normalizeEmail } from "@/lib/auth-email";
import { prisma } from "@/lib/prisma";
import { verifyPassword } from "@/lib/password";

const bodySchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
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
  const { password } = parsed.data;
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) {
    return NextResponse.json({ error: "Invalid email or password" }, { status: 401 });
  }

  if (!user.passwordHash) {
    return NextResponse.json(
      { error: "This account uses Google sign-in. Continue with Google instead." },
      { status: 401 }
    );
  }

  if (!(await verifyPassword(password, user.passwordHash))) {
    return NextResponse.json({ error: "Invalid email or password" }, { status: 401 });
  }

  if (!user.emailVerifiedAt) {
    return NextResponse.json(
      {
        error: "Please verify your email before signing in",
        requiresVerification: true,
        email: user.email,
      },
      { status: 403 }
    );
  }

  const res = NextResponse.json({
    user: { id: user.id, email: user.email, name: user.name },
  });
  return attachAuthCookie(res, user.id);
}
