import { TwitterApi, ApiResponseError } from "twitter-api-v2";
import { SHARE_HASHTAG_TAGS } from "@/lib/share";

const X_API_402_HINT =
  "X API が 402（Payment Required）を返しました。投稿（POST）は有料の利用枠やクレジットが必要なことがあります。developer.x.com の開発者コンソールで「請求」「Credits / Pay Per Use」の残高・支払い方法、およびアプリの API アクセスレベル（投稿が含まれるプランか）を確認してください。";

const MAX_TWEET_CHARS = 280;
/** 応援メッセージが収まらないときに付ける省略記号 */
const MESSAGE_ELLIPSIS = "...";

function graphemeCount(s: string): number {
  return Array.from(s).length;
}

/** 【応援者】＋任意個のハッシュタグ（末尾）。タグは 280 に収まるまで末尾から削る。 */
function buildSupporterAndHashtagsSuffix(
  name: string,
  tags: readonly string[]
): string {
  const n = name.trim() || "（匿名）";
  const base = `\n【応援者】${n}`;
  if (tags.length === 0) {
    return base;
  }
  const line = tags.map((t) => `#${t.replace(/^#/, "")}`).join(" ");
  return `${base}\n\n${line}`;
}

/** 応援者行＋ハッシュタグが 280 に収まるようタグを減らし、極端に長い名前は省略する */
function fitSupporterHashtagSuffix(name: string): string {
  let tags: string[] = [...SHARE_HASHTAG_TAGS];
  let displayName = name.trim() || "（匿名）";

  for (;;) {
    const suffix = buildSupporterAndHashtagsSuffix(displayName, tags);
    const len = graphemeCount(suffix);
    if (len <= MAX_TWEET_CHARS) {
      return suffix;
    }
    if (tags.length > 0) {
      tags = tags.slice(0, -1);
      continue;
    }
    const prefix = "\n【応援者】";
    const maxName =
      MAX_TWEET_CHARS - graphemeCount(prefix) - graphemeCount(MESSAGE_ELLIPSIS);
    if (maxName <= 0) {
      return `${prefix}${MESSAGE_ELLIPSIS}`;
    }
    displayName =
      Array.from(displayName).slice(0, maxName).join("") + MESSAGE_ELLIPSIS;
  }
}

function buildSupportTweetText(message: string, name: string): string {
  const m = message.trim();
  const suffix = fitSupporterHashtagSuffix(name);
  const full = `${m}${suffix}`;
  if (graphemeCount(full) <= MAX_TWEET_CHARS) {
    return full;
  }
  const suffixLen = graphemeCount(suffix);
  const budget =
    MAX_TWEET_CHARS - suffixLen - graphemeCount(MESSAGE_ELLIPSIS);
  const chars = Array.from(m);
  const head = chars.slice(0, Math.max(0, budget)).join("");
  return `${head}${MESSAGE_ELLIPSIS}${suffix}`;
}

export function formatSupportMessageForXPost(message: string, name: string): string {
  return buildSupportTweetText(message, name);
}

export function hasTwitterUserCredentials(): boolean {
  return Boolean(
    process.env.TWITTER_API_KEY?.trim() &&
      process.env.TWITTER_API_SECRET?.trim() &&
      process.env.TWITTER_ACCESS_TOKEN?.trim() &&
      process.env.TWITTER_ACCESS_TOKEN_SECRET?.trim()
  );
}

function formatTwitterApiError(e: ApiResponseError): string {
  if (e.code === 402) {
    return X_API_402_HINT;
  }
  const parts: string[] = [`Request failed with code ${e.code}`];
  const d = e.data;
  if (d?.detail) parts.push(String(d.detail));
  else if (d?.title) parts.push(String(d.title));
  const first = d?.errors?.[0];
  if (first && typeof first === "object" && "message" in first) {
    parts.push(String((first as { message: string }).message));
  }
  return parts.join(" — ");
}

export async function postTweetAsConfiguredUser(text: string): Promise<{
  id: string;
}> {
  if (!hasTwitterUserCredentials()) {
    throw new Error("Twitter の投稿用認証情報が設定されていません。");
  }
  const client = new TwitterApi({
    appKey: process.env.TWITTER_API_KEY!.trim(),
    appSecret: process.env.TWITTER_API_SECRET!.trim(),
    accessToken: process.env.TWITTER_ACCESS_TOKEN!.trim(),
    accessSecret: process.env.TWITTER_ACCESS_TOKEN_SECRET!.trim(),
  });
  const rw = client.readWrite;
  try {
    const { data } = await rw.v2.tweet(text);
    if (!data?.id) {
      throw new Error("X API からツイート ID が返りませんでした。");
    }
    return { id: data.id };
  } catch (err) {
    if (err instanceof ApiResponseError) {
      throw new Error(formatTwitterApiError(err));
    }
    throw err;
  }
}
