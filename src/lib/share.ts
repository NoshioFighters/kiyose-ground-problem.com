/** X Web Intent（仕様どおりの文言・ハッシュタグ） */
export function getShareIntentUrl(): string {
  const text = encodeURIComponent(
    "清瀬市で少年野球チームの対外試合が禁止されました。子どもたちのスポーツ環境を守るため、声を広げてください。 kiyose-ground-problem.com"
  );
  const hashtags = encodeURIComponent(
    "監督、野球ができるよう市長にお願いしてくる,清瀬市,学童野球,小学校グランド利用問題"
  );
  return `https://twitter.com/intent/tweet?text=${text}&hashtags=${hashtags}`;
}
