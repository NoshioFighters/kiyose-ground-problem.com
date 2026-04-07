import { NextResponse } from "next/server";
import {
  getTweetCache,
  isCacheFresh,
  saveTweetCache,
  getAdminDb,
} from "@/lib/firestore";
import { fetchUserTweetsFromX } from "@/lib/twitter";

const CACHE_TTL_MS = 60 * 60 * 1000;

export const dynamic = "force-dynamic";

export async function GET() {
  const dbReady = Boolean(getAdminDb());

  try {
    const cached = await getTweetCache();

    if (cached && isCacheFresh(cached.updatedAt, CACHE_TTL_MS)) {
      return NextResponse.json({
        tweets: cached.tweets.slice(0, 6),
        cached: true,
        updatedAt: cached.updatedAt.toDate().toISOString(),
      });
    }

    if (!dbReady) {
      return NextResponse.json({
        tweets: [],
        cached: false,
        updatedAt: null as string | null,
        notice:
          "Firestore が未設定のため、X API を呼び出さずプレースホルダーを表示します。",
      });
    }

    const fresh = await fetchUserTweetsFromX();

    if (fresh.length > 0) {
      await saveTweetCache(fresh);
      const afterSave = await getTweetCache();
      return NextResponse.json({
        tweets: fresh.slice(0, 6),
        cached: false,
        updatedAt: afterSave?.updatedAt.toDate().toISOString() ?? null,
      });
    }

    if (cached?.tweets?.length) {
      return NextResponse.json({
        tweets: cached.tweets.slice(0, 6),
        cached: true,
        updatedAt: cached.updatedAt.toDate().toISOString(),
        degraded: true,
      });
    }

    return NextResponse.json({
      tweets: [],
      cached: false,
      updatedAt: null as string | null,
    });
  } catch {
    const stale = await getTweetCache();
    if (stale?.tweets?.length) {
      return NextResponse.json({
        tweets: stale.tweets.slice(0, 6),
        cached: true,
        updatedAt: stale.updatedAt.toDate().toISOString(),
        degraded: true,
      });
    }
    return NextResponse.json(
      { tweets: [], cached: false, updatedAt: null },
      { status: 200 }
    );
  }
}
