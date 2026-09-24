import { NextResponse } from "next/server";
import { createDeadline, getAllDeadlines } from "@/lib/db";

export const runtime = "edge";
// Neon の DB リージョン（ap-southeast-1 = Singapore）に合わせて実行リージョンを固定し、
// Edge Function <-> DB 間の往復レイテンシを削減する
export const preferredRegion = "sin1";

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
