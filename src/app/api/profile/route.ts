import { NextResponse } from "next/server";
import { getProfile } from "@/server/portfolio";

export async function GET() {
  const profile = await getProfile();
  return NextResponse.json({ profile });
}
