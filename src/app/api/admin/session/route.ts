import { NextResponse } from "next/server";
import { z } from "zod";
import {
  clearAdminSession,
  isAdminConfigured,
  isAdminSession,
  setAdminSession,
  verifyAdminPassword,
} from "@/server/auth";

const loginSchema = z.object({
  password: z.string().min(1),
});

export async function GET() {
  return NextResponse.json({
    authenticated: await isAdminSession(),
    configured: isAdminConfigured(),
  });
}

export async function POST(request: Request) {
  if (!isAdminConfigured()) {
    return NextResponse.json({ error: "Admin auth is not configured" }, { status: 503 });
  }

  const body = await request.json().catch(() => null);
  const parsed = loginSchema.safeParse(body);

  if (!parsed.success || !verifyAdminPassword(parsed.data.password)) {
    return NextResponse.json({ error: "Invalid password" }, { status: 401 });
  }

  await setAdminSession();
  return NextResponse.json({ ok: true });
}

export async function DELETE() {
  await clearAdminSession();
  return NextResponse.json({ ok: true });
}
