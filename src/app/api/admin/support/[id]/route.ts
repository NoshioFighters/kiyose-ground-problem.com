import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { updateSupportMessageShowOnLP, getAdminDb } from "@/lib/firestore";

export const dynamic = "force-dynamic";

function isAdmin(): boolean {
  const adminPassword = process.env.ADMIN_PASSWORD;
  const token = cookies().get("admin_token");
  return Boolean(
    adminPassword && token && token.value === adminPassword
  );
}

export async function PATCH(
  req: Request,
  { params }: { params: { id: string } }
) {
  if (!isAdmin()) {
    return NextResponse.json({ error: "認証が必要です。" }, { status: 401 });
  }
  if (!getAdminDb()) {
    return NextResponse.json({ error: "DB が未設定です。" }, { status: 503 });
  }

  const id = params.id;
  if (!id) {
    return NextResponse.json({ error: "不正な ID です。" }, { status: 400 });
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "JSON が不正です。" }, { status: 400 });
  }

  if (!body || typeof body !== "object") {
    return NextResponse.json({ error: "リクエストが不正です。" }, { status: 400 });
  }

  const showOnLP = (body as { showOnLP?: unknown }).showOnLP;
  if (typeof showOnLP !== "boolean") {
    return NextResponse.json(
      { error: "showOnLP は boolean である必要があります。" },
      { status: 400 }
    );
  }

  const ok = await updateSupportMessageShowOnLP(id, showOnLP);
  if (!ok) {
    return NextResponse.json({ error: "ドキュメントが見つかりません。" }, { status: 404 });
  }

  return NextResponse.json({ ok: true, showOnLP });
}
