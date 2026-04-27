import { NextResponse } from "next/server";
import { Resend } from "resend";
import { z } from "zod";

const schema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  message: z.string().min(10).max(1000),
  website: z.string().optional(),
});

const attempts = new Map<string, { count: number; resetAt: number }>();

function rateLimited(ip: string) {
  const now = Date.now();
  const current = attempts.get(ip);

  if (!current || current.resetAt < now) {
    attempts.set(ip, { count: 1, resetAt: now + 60 * 60 * 1000 });
    return false;
  }

  current.count += 1;
  return current.count > 5;
}

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const parsed = schema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }

  if (parsed.data.website) {
    return NextResponse.json({ ok: true });
  }

  const forwardedFor = request.headers.get("x-forwarded-for") ?? "unknown";
  const ip = forwardedFor.split(",")[0]?.trim() ?? "unknown";

  if (rateLimited(ip)) {
    return NextResponse.json({ error: "Too many requests" }, { status: 429 });
  }

  const apiKey = process.env.RESEND_API_KEY;
  const contactEmail = process.env.CONTACT_EMAIL ?? "prakhar.nagpal@u.nus.edu";

  if (!apiKey) {
    return NextResponse.json({ error: "Email is not configured" }, { status: 503 });
  }

  const resend = new Resend(apiKey);
  await resend.emails.send({
    from: "Portfolio <onboarding@resend.dev>",
    to: contactEmail,
    replyTo: parsed.data.email,
    subject: `Portfolio message from ${parsed.data.name}`,
    text: parsed.data.message,
  });

  return NextResponse.json({ ok: true });
}
