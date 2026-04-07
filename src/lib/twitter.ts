export type Tweet = {
  id: string;
  text: string;
  created_at: string;
  public_metrics: {
    like_count: number;
    retweet_count: number;
  };
};

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
  const url = `https://api.twitter.com/2/users/by/username/${encodeURIComponent(username)}`;
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
  const userRef = process.env.TWITTER_USER_ID?.trim();
  if (!bearerToken || !userRef) {
    return [];
  }
  const userId = await resolveUserId(bearerToken, userRef);
  if (!userId) {
    return [];
  }
  const params = new URLSearchParams({
    max_results: "10",
    "tweet.fields": "created_at,public_metrics",
  });
  const url = `https://api.twitter.com/2/users/${userId}/tweets?${params}`;
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
