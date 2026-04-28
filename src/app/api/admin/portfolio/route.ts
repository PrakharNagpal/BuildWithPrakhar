import { NextResponse } from "next/server";
import { ZodError } from "zod";
import { isAdminSession } from "@/server/auth";
import { getAdminPortfolioData, updateAdminPortfolioData } from "@/server/admin";

async function requireAdmin() {
  if (!(await isAdminSession())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  return null;
}

export async function GET() {
  const unauthorized = await requireAdmin();

  if (unauthorized) {
    return unauthorized;
  }

  try {
    return NextResponse.json({ portfolio: await getAdminPortfolioData() });
  } catch (error) {
    console.error("Admin portfolio read error", error);
    return NextResponse.json({ error: "Admin data is not available" }, { status: 503 });
  }
}

export async function PUT(request: Request) {
  const unauthorized = await requireAdmin();

  if (unauthorized) {
    return unauthorized;
  }

  const body = await request.json().catch(() => null);

  try {
    return NextResponse.json({ portfolio: await updateAdminPortfolioData(body) });
  } catch (error) {
    if (error instanceof ZodError) {
      return NextResponse.json({ error: "Invalid portfolio data", issues: error.issues }, { status: 400 });
    }

    console.error("Admin portfolio update error", error);
    return NextResponse.json({ error: "Portfolio update failed" }, { status: 500 });
  }
}
