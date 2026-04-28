import { NextResponse } from "next/server";
import { getExperience } from "@/server/portfolio";

export async function GET() {
  const experience = await getExperience();
  return NextResponse.json({ experience });
}
