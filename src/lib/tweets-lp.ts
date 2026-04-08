import {
  getTweetCache,
  isCacheFresh,
  saveTweetCache,
  getAdminDb,
} from "@/lib/firestore";
import { fetchUserTweetsFromX, type Tweet } from "@/lib/twitter";

export type { Tweet };

export type TweetsLpPayload = {
  tweets: Tweet[];
  cached: boolean;
  updatedAt: string | null;
  degraded?: boolean;
  /** 投稿が 0 件のときの管理者・開発者向けヒント */
  notice?: string;
};

const CACHE_TTL_MS = 60 * 60 * 1000;
export const LP_TWEET_DISPLAY_LIMIT = 6;

function noticeWhenNoTweets(): string | undefined {
  if (!process.env.TWITTER_BEARER_TOKEN?.trim()) {
    return "X API の Bearer トークン（TWITTER_BEARER_TOKEN）が未設定のため、投稿を取得できません。";
  }
  return "X から投稿を取得できませんでした。TWITTER_USER_ID（ユーザー名または数値 ID）、トークンの権限、API の利用枠（読み取りクレジット等）をご確認ください。";
}

/**
 * トップ「最新の活動情報」用。Firestore キャッシュ（1h）＋ X API v2（Bearer）。
 * `/api/tweets` と同じロジックを共有する。
 */
export async function getTweetsForLp(): Promise<TweetsLpPayload> {
  const dbReady = Boolean(getAdminDb());

  try {
    const cached = await getTweetCache();

    if (cached && isCacheFresh(cached.updatedAt, CACHE_TTL_MS)) {
      return {
        tweets: cached.tweets.slice(0, LP_TWEET_DISPLAY_LIMIT),
        cached: true,
        updatedAt: cached.updatedAt.toDate().toISOString(),
      };
    }

    if (!dbReady) {
      return {
        tweets: [],
        cached: false,
        updatedAt: null,
        notice:
          "Firestore が未設定のため、X API を呼び出せず投稿を表示できません。FIREBASE_* を .env に設定してください。",
      };
    }

    const fresh = await fetchUserTweetsFromX();

    if (fresh.length > 0) {
      await saveTweetCache(fresh);
      const afterSave = await getTweetCache();
      return {
        tweets: fresh.slice(0, LP_TWEET_DISPLAY_LIMIT),
        cached: false,
        updatedAt: afterSave?.updatedAt.toDate().toISOString() ?? null,
      };
    }

    if (cached?.tweets?.length) {
      return {
        tweets: cached.tweets.slice(0, LP_TWEET_DISPLAY_LIMIT),
        cached: true,
        updatedAt: cached.updatedAt.toDate().toISOString(),
        degraded: true,
      };
    }

    return {
      tweets: [],
      cached: false,
      updatedAt: null,
      notice: noticeWhenNoTweets(),
    };
  } catch {
    const stale = await getTweetCache();
    if (stale?.tweets?.length) {
      return {
        tweets: stale.tweets.slice(0, LP_TWEET_DISPLAY_LIMIT),
        cached: true,
        updatedAt: stale.updatedAt.toDate().toISOString(),
        degraded: true,
      };
    }
    return {
      tweets: [],
      cached: false,
      updatedAt: null,
      notice: noticeWhenNoTweets(),
    };
  }
}
