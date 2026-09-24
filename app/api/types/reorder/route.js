import { NextResponse } from "next/server";
import { reorderTypes } from "@/lib/db";

export const runtime = "edge";
export const preferredRegion = "sin1";

export async function POST(request) {
  try {
    const body = await request.json();
    if (!Array.isArray(body.orderedIds)) {
      throw new Error("orderedIds が不正です");
    }
    await reorderTypes(body.orderedIds);
    return NextResponse.json({ ok: true });
  } catch (e) {
    return NextResponse.json({ error: e.message }, { status: 400 });
  }
}
