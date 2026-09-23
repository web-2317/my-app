import { NextResponse } from "next/server";
import { getAllCompanies } from "@/lib/db";

export const runtime = "edge";

export async function GET() {
  try {
    const companies = await getAllCompanies();
    return NextResponse.json(companies);
  } catch (e) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
