import { NextResponse } from "next/server";
import { createType, getAllTypes } from "@/lib/db";

export const runtime = "edge";
export const preferredRegion = "sin1";

export async function GET() {
  try {
    const types = await getAllTypes();
    return NextResponse.json(types);
  } catch (e) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    const item = await createType(body);
    return NextResponse.json(item, { status: 201 });
  } catch (e) {
    return NextResponse.json({ error: e.message }, { status: 400 });
  }
}
