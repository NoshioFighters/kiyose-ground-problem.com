export function ProblemSection() {
  return (
    <section
      id="problem"
      className="scroll-mt-20 border-b border-border bg-white px-4 py-14 sm:py-16"
      aria-labelledby="problem-heading"
    >
      <div className="mx-auto max-w-4xl">
        <h2
          id="problem-heading"
          className="text-center text-2xl font-bold text-body sm:text-3xl"
        >
          何が問題なのか
        </h2>
        <p className="mx-auto mt-3 max-w-2xl text-center text-sm text-muted sm:text-base">
          通達日：2026年2月16日・19日（清瀬市教育委員会 生涯学習スポーツ課）
        </p>
        <div className="mt-10 grid gap-6 sm:grid-cols-2">
          <article className="rounded-xl border border-border bg-surface p-6 shadow-sm">
            <h3 className="text-lg font-bold text-body">対外試合の禁止</h3>
            <p className="mt-3 text-sm leading-relaxed text-muted sm:text-base">
              登録団体以外のチームを招いての試合が全面禁止。子どもたちの試合機会が激減します。
            </p>
          </article>
          <article className="rounded-xl border border-border bg-surface p-6 shadow-sm">
            <h3 className="text-lg font-bold text-body">駐車場利用は1台のみ</h3>
            <p className="mt-3 text-sm leading-relaxed text-muted sm:text-base">
              小中学校利用時の駐車は1台に制限。低学年の送迎や高齢スタッフの移動が困難になります。
            </p>
          </article>
        </div>
      </div>
    </section>
  );
}
