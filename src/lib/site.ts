import { SITE_URL } from "./share";

function normalizeOrigin(input: string): string {
  const withScheme = input.includes("://") ? input : `https://${input}`;
  return new URL(withScheme).origin;
}

/**
 * canonical・sitemap・robots 用のオリジン。
 * プレビュー URL などは NEXT_PUBLIC_SITE_URL で上書き可能。
 */
export function getSiteOrigin(): string {
  const raw = process.env.NEXT_PUBLIC_SITE_URL?.trim();
  if (raw) {
    try {
      return normalizeOrigin(raw);
    } catch {
      /* fall through */
    }
  }
  try {
    return normalizeOrigin(SITE_URL);
  } catch {
    return "https://kiyose-ground-problem.com";
  }
}
