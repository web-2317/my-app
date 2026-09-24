import { NextResponse } from "next/server";
import { deleteDeadline, updateDeadline } from "@/lib/db";

export const runtime = "edge";
export const preferredRegion = "sin1";

export async function PUT(request, { params }) {
  try {
    const body = await request.json();
    const item = await updateDeadline(params.id, body);
    if (!item) {
      return NextResponse.json({ error: "見つかりません" }, { status: 404 });
    }
    return NextResponse.json(item);
  } catch (e) {
    return NextResponse.json({ error: e.message }, { status: 400 });
  }
}

export async function DELETE(_request, { params }) {
  try {
    const ok = await deleteDeadline(params.id);
    if (!ok) {
      return NextResponse.json({ error: "見つかりません" }, { status: 404 });
    }
    return new NextResponse(null, { status: 204 });
  } catch (e) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
