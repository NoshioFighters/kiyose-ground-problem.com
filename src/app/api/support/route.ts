import { NextResponse } from "next/server";
import { getAdminDb, saveSupportMessage } from "@/lib/firestore";
import { sendSupportMessageNotification } from "@/lib/resend";

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  if (!getAdminDb()) {
    return NextResponse.json(
      { error: "保存先が設定されていません。" },
      { status: 503 }
    );
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "JSON の形式が正しくありません。" }, { status: 400 });
  }

  if (!body || typeof body !== "object") {
    return NextResponse.json({ error: "リクエストが不正です。" }, { status: 400 });
  }

  const { name, email, message } = body as Record<string, unknown>;
  const nameStr = typeof name === "string" ? name.trim() : "";
  const messageStr = typeof message === "string" ? message.trim() : "";
  const emailStr =
    typeof email === "string" && email.trim() ? email.trim() : "";

  if (!nameStr) {
    return NextResponse.json({ error: "お名前は必須です。" }, { status: 400 });
  }
  if (!messageStr) {
    return NextResponse.json(
      { error: "応援メッセージは必須です。" },
      { status: 400 }
    );
  }

  try {
    await saveSupportMessage({
      name: nameStr,
      email: emailStr,
      message: messageStr,
    });
  } catch {
    return NextResponse.json(
      { error: "送信に失敗しました。しばらくしてから再度お試しください。" },
      { status: 500 }
    );
  }

  const receivedAtIso = new Date().toLocaleString("ja-JP", {
    timeZone: "Asia/Tokyo",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });

  void sendSupportMessageNotification({
    name: nameStr,
    email: emailStr,
    message: messageStr,
    receivedAtIso,
  });

  return NextResponse.json({ ok: true });
}
