/** LP の正規 URL（X 共有でリンク化させるため https を含める） */
export const SITE_URL = "https://kiyose-ground-problem.com/";

/** LP 共有・管理画面からの X 投稿で共通利用するハッシュタグ（# なし・Intent 用はカンマ区切り） */
export const SHARE_HASHTAG_TAGS = [
  "監督野球ができるよう市長にお願いしてくる",
  "清瀬市",
  "学童野球",
  "小学校グランド利用問題",
] as const;

/** X Web Intent（文言・サイト URL・ハッシュタグ） */
export function getShareIntentUrl(): string {
  const text = encodeURIComponent(
    "清瀬市で少年野球チームの対外試合が禁止されました。子どもたちのスポーツ環境を守るため、声を広げてください。"
  );
  const url = encodeURIComponent(SITE_URL);
  const hashtags = encodeURIComponent(SHARE_HASHTAG_TAGS.join(","));
  return `https://twitter.com/intent/tweet?text=${text}&url=${url}&hashtags=${hashtags}`;
}
