import { NextResponse } from "next/server";
import { createDeadline, getAllDeadlines } from "@/lib/db";

export async function GET() {
  try {
    const deadlines = await getAllDeadlines();
    return NextResponse.json(deadlines);
  } catch (e) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    const item = await createDeadline(body);
    return NextResponse.json(item, { status: 201 });
  } catch (e) {
    return NextResponse.json({ error: e.message }, { status: 400 });
  }
}
