import { NextResponse } from "next/server";
import { getSkills } from "@/server/portfolio";

export async function GET() {
  const skills = await getSkills();
  return NextResponse.json({ skills });
}
