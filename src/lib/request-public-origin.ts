import { getSiteOrigin } from "./site";

/**
 * Location ヘッダー用の公開オリジン。
 * App Hosting 等のプロキシでは x-forwarded-* を優先し、
 * 開発で 0.0.0.0 にバインドしていると request.url のホストが使えないため localhost に置き換える。
 */
export function getPublicOrigin(
  headers: Headers,
  requestUrl: string | URL
): string {
  const fallback =
    typeof requestUrl === "string" ? new URL(requestUrl) : requestUrl;

  const forwardedProto = headers
    .get("x-forwarded-proto")
    ?.split(",")[0]
    ?.trim();
  const forwardedHost = headers
    .get("x-forwarded-host")
    ?.split(",")[0]
    ?.trim();

  if (forwardedHost) {
    const scheme =
      forwardedProto === "https" || forwardedProto === "http"
        ? forwardedProto
        : "https";
    return `${scheme}://${forwardedHost}`;
  }

  const hostHeader = headers.get("host");
  if (hostHeader) {
    let host = hostHeader;
    const hostname = host.split(":")[0];
    if (hostname === "0.0.0.0") {
      const portPart = host.includes(":")
        ? host.slice(host.indexOf(":"))
        : "";
      host = `localhost${portPart}`;
    }
    const scheme = fallback.protocol.replace(":", "") || "http";
    return `${scheme}://${host}`;
  }

  return getSiteOrigin();
}

export function publicRedirectUrl(
  pathWithQuery: string,
  headers: Headers,
  requestUrl: string | URL
): URL {
  const origin = getPublicOrigin(headers, requestUrl);
  return new URL(
    pathWithQuery.startsWith("/") ? pathWithQuery : `/${pathWithQuery}`,
    `${origin}/`
  );
}
