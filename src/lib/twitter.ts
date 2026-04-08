export type Tweet = {
  id: string;
  text: string;
  created_at: string;
  public_metrics: {
    like_count: number;
    /** X ではリポスト。API フィールド名は従来どおり retweet_count */
    retweet_count: number;
  };
};

function getTwitterApiBase(): string {
  const raw = process.env.TWITTER_API_BASE_URL?.trim();
  if (raw) {
    return raw.replace(/\/$/, "");
  }
  return "https://api.twitter.com";
}

/** 未設定時は LP 表記どおり @kiyoseground を参照 */
function getEffectiveUserRef(): string {
  const v = process.env.TWITTER_USER_ID?.trim();
  return v && v.length > 0 ? v : "kiyoseground";
}

type UsersByUsernameResponse = {
  data?: { id: string };
  errors?: { message: string }[];
};

type UserTweetsResponse = {
  data?: Tweet[];
  meta?: { result_count?: number };
  errors?: { message: string }[];
};

async function resolveUserId(
  bearerToken: string,
  userIdOrUsername: string
): Promise<string | null> {
  if (/^\d+$/.test(userIdOrUsername.trim())) {
    return userIdOrUsername.trim();
  }
  const username = userIdOrUsername.replace(/^@/, "").trim();
  const base = getTwitterApiBase();
  const url = `${base}/2/users/by/username/${encodeURIComponent(username)}`;
  const res = await fetch(url, {
    headers: { Authorization: `Bearer ${bearerToken}` },
    next: { revalidate: 0 },
  });
  if (!res.ok) return null;
  const json = (await res.json()) as UsersByUsernameResponse;
  return json.data?.id ?? null;
}

export async function fetchUserTweetsFromX(): Promise<Tweet[]> {
  const bearerToken = process.env.TWITTER_BEARER_TOKEN?.trim();
  if (!bearerToken) {
    return [];
  }
  const userRef = getEffectiveUserRef();
  const userId = await resolveUserId(bearerToken, userRef);
  if (!userId) {
    return [];
  }
  const base = getTwitterApiBase();
  const params = new URLSearchParams({
    max_results: "10",
    "tweet.fields": "created_at,public_metrics",
    exclude: "retweets,replies",
  });
  const url = `${base}/2/users/${userId}/tweets?${params}`;
  const res = await fetch(url, {
    headers: { Authorization: `Bearer ${bearerToken}` },
    next: { revalidate: 0 },
  });
  if (!res.ok) {
    return [];
  }
  const json = (await res.json()) as UserTweetsResponse;
  if (!json.data?.length) {
    return [];
  }
  return json.data.slice(0, 10);
}
