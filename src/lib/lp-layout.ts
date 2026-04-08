/**
 * LP ルートのレイアウト定数（編集時はここを基準に揃える）
 *
 * - `main` に `overflow-x-hidden` / `overflow-x-clip` を付けない（カードの影が切れる）
 * - 横方向の抑制は `globals.css` の html / body の `overflow-x: hidden` に任せる
 * - 狭い幅では flex 子に `min-w-0` が必要なことが多い
 */
export const lpRootMainClass = "w-full min-w-0 grow" as const;
