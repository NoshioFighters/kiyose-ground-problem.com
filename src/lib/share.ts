/** X Web Intent（仕様どおりの文言・ハッシュタグ） */
export function getShareIntentUrl(): string {
  const text = encodeURIComponent(
    "清瀬市が少年野球チームの対外試合を禁止しました。子どもたちの野球を守るため、声を上げてください。 kiyose-ground-problem.com"
  );
  const hashtags = encodeURIComponent(
    "監督野球ができるよう市長のお願いしてくる,清瀬市,学童野球,小学校グランド利用問題"
  );
  return `https://twitter.com/intent/tweet?text=${text}&hashtags=${hashtags}`;
}
