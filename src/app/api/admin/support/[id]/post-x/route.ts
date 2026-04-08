import { NextResponse } from "next/server";
import { isAdminSession } from "@/lib/admin-auth";
import {
  getAdminDb,
  getSupportMessageById,
  markSupportMessagePostedToX,
} from "@/lib/firestore";
import {
  formatSupportMessageForXPost,
  hasTwitterUserCredentials,
  postTweetAsConfiguredUser,
} from "@/lib/twitter-post";

export const dynamic = "force-dynamic";

export async function POST(
  _req: Request,
  { params }: { params: { id: string } }
) {
  if (!isAdminSession()) {
    return NextResponse.json({ error: "認証が必要です。" }, { status: 401 });
  }
  if (!getAdminDb()) {
    return NextResponse.json({ error: "DB が未設定です。" }, { status: 503 });
  }
  if (!hasTwitterUserCredentials()) {
    return NextResponse.json(
      {
        error:
          "X への投稿用の環境変数（TWITTER_API_KEY / TWITTER_API_SECRET / TWITTER_ACCESS_TOKEN / TWITTER_ACCESS_TOKEN_SECRET）が未設定です。",
      },
      { status: 503 }
    );
  }

  const id = params.id;
  if (!id) {
    return NextResponse.json({ error: "不正な ID です。" }, { status: 400 });
  }

  const row = await getSupportMessageById(id);
  if (!row) {
    return NextResponse.json({ error: "ドキュメントが見つかりません。" }, { status: 404 });
  }

  if (row.postedToXAt) {
    return NextResponse.json({
      ok: true,
      alreadyPosted: true,
      tweetId: row.xTweetId ?? undefined,
    });
  }

  const text = formatSupportMessageForXPost(row.message, row.name);

  let tweetId: string;
  try {
    const posted = await postTweetAsConfiguredUser(text);
    tweetId = posted.id;
  } catch (e) {
    const msg =
      e instanceof Error ? e.message : "X への投稿に失敗しました。";
    console.error("[post-x]", e);
    return NextResponse.json({ error: msg }, { status: 502 });
  }

  const ok = await markSupportMessagePostedToX(id, tweetId);
  if (!ok) {
    return NextResponse.json(
      { error: "投稿は成功しましたが、Firestore の更新に失敗しました。" },
      { status: 500 }
    );
  }

  return NextResponse.json({ ok: true, tweetId });
}
