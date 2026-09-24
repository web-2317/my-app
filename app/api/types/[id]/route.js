import { NextResponse } from "next/server";
import { deleteType, updateType } from "@/lib/db";

export const runtime = "edge";
export const preferredRegion = "sin1";

export async function PUT(request, { params }) {
  try {
    const body = await request.json();
    const item = await updateType(params.id, body);
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
    const result = await deleteType(params.id);
    if (!result.ok) {
      if (result.reason === "not_found") {
        return NextResponse.json({ error: "見つかりません" }, { status: 404 });
      }
      return NextResponse.json(
        { error: "この種別は締め切りで使用されているため削除できません" },
        { status: 409 }
      );
    }
    return new NextResponse(null, { status: 204 });
  } catch (e) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
