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
          何が変わったのか
        </h2>
        <div className="mt-10 grid gap-6 sm:grid-cols-2">
          <article className="rounded-xl border border-border bg-surface p-6 shadow-sm">
            <h3 className="text-lg font-bold text-body">
              対外試合ができなくなりました
            </h3>
            <p className="mt-3 text-sm leading-relaxed text-muted sm:text-base">
              2026年2月の通達により、各小中学校に登録されていない外部チームを招いての試合が禁止されました。子どもたちが他チームと切磋琢磨する機会が失われます。
            </p>
          </article>
          <article className="rounded-xl border border-border bg-surface p-6 shadow-sm">
            <h3 className="text-lg font-bold text-body">
              駐車場が1台しか使えません
            </h3>
            <p className="mt-3 text-sm leading-relaxed text-muted sm:text-base">
              学校施設を利用する際、駐車できる車は1台のみに制限されました。低学年の送迎や、遠方からのスタッフ・保護者の参加が困難になります。
            </p>
          </article>
        </div>
      </div>
    </section>
  );
}
