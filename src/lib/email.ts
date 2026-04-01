const RESEND_API_URL = "https://api.resend.com/emails";

function getEmailConfig() {
  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.EMAIL_FROM;
  if (!apiKey || !from) {
    throw new Error("RESEND_API_KEY and EMAIL_FROM must be configured");
  }
  return { apiKey, from };
}

export async function sendVerificationCodeEmail(input: {
  email: string;
  code: string;
}) {
  const { apiKey, from } = getEmailConfig();

  const response = await fetch(RESEND_API_URL, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from,
      to: input.email,
      subject: "Verify your GoalTrack email",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 560px; margin: 0 auto; padding: 24px; color: #18181b;">
          <p style="font-size: 12px; letter-spacing: 0.22em; text-transform: uppercase; color: #047857; font-weight: 700;">GoalTrack</p>
          <h1 style="font-size: 28px; line-height: 1.2; margin: 16px 0 8px;">Verify your email</h1>
          <p style="font-size: 15px; line-height: 1.7; color: #52525b; margin: 0 0 24px;">
            Enter this code to finish setting up your account. It expires in 10 minutes.
          </p>
          <div style="font-size: 32px; font-weight: 700; letter-spacing: 0.3em; color: #111827; padding: 18px 20px; background: #f4f4f5; border-radius: 16px; text-align: center;">
            ${input.code}
          </div>
          <p style="font-size: 13px; line-height: 1.7; color: #71717a; margin-top: 24px;">
            If you did not create a GoalTrack account, you can safely ignore this email.
          </p>
        </div>
      `,
    }),
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`Failed to send verification email: ${text}`);
  }
}
