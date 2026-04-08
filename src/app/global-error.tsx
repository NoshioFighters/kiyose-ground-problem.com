"use client";

/**
 * ルート layout より外側のエラー用（独自の html/body が必須）。
 * 開発時のチャンク不整合などで通常の error.tsx が届かない場合の保険。
 */
export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="ja">
      <body
        style={{
          margin: 0,
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          padding: "1rem",
          fontFamily: "system-ui, sans-serif",
          background: "#fff",
          color: "#0f172a",
        }}
      >
        <h1 style={{ fontSize: "1.125rem", fontWeight: 700, textAlign: "center" }}>
          表示中にエラーが発生しました
        </h1>
        <p
          style={{
            marginTop: "0.75rem",
            maxWidth: "28rem",
            textAlign: "center",
            fontSize: "0.875rem",
            color: "#64748b",
          }}
        >
          開発中は <code style={{ fontSize: "0.8em" }}>npm run dev:clean</code>{" "}
          でキャッシュを消してから起動し直してください。
        </p>
        {process.env.NODE_ENV === "development" && (
          <pre
            style={{
              marginTop: "1rem",
              maxHeight: "10rem",
              maxWidth: "100%",
              overflow: "auto",
              padding: "0.75rem",
              fontSize: "0.75rem",
              background: "#f1f5f9",
              borderRadius: "0.5rem",
            }}
          >
            {error.message}
          </pre>
        )}
        <button
          type="button"
          onClick={() => reset()}
          style={{
            marginTop: "1.25rem",
            padding: "0.6rem 1.25rem",
            fontSize: "0.875rem",
            fontWeight: 600,
            color: "#fff",
            background: "#0f172a",
            border: "none",
            borderRadius: "0.5rem",
            cursor: "pointer",
          }}
        >
          再試行
        </button>
      </body>
    </html>
  );
}
