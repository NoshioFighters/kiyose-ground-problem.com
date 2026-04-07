export function LegalSection() {
  return (
    <section
      className="border-b border-border bg-white px-4 py-14 sm:py-16"
      aria-labelledby="legal-heading"
    >
      <div className="mx-auto max-w-4xl">
        <h2
          id="legal-heading"
          className="text-center text-2xl font-bold text-body sm:text-3xl"
        >
          このルールは法令・市の方針と矛盾します
        </h2>
        <div className="mt-10 space-y-6">
          <div className="rounded-xl border-l-4 border-accent bg-surface p-6 shadow-sm">
            <h3 className="text-lg font-bold text-body">スポーツ基本法 第13条</h3>
            <blockquote className="mt-3 border-none text-sm leading-relaxed text-muted sm:text-base">
              「学校設置者は、教育に支障のない限り、学校体育施設を地域スポーツのために積極的に開放するよう努めなければならない。」
            </blockquote>
            <p className="mt-2 text-xs text-muted sm:text-sm">
              （文部科学省「学校体育施設の有効活用に関する手引き」令和7年改訂）
            </p>
          </div>
          <div className="rounded-xl border-l-4 border-accent bg-surface p-6 shadow-sm">
            <h3 className="text-lg font-bold text-body">
              清瀬市の掲げるコンセプトとの矛盾
            </h3>
            <p className="mt-3 text-sm leading-relaxed text-muted sm:text-base">
              清瀬市の戦略コンセプト：「子どもと幸せを育む&quot;舞台&quot;」
              <br />
              ―子育て世代が暮らし続けられるまちを目指すとしながら、子どもたちのスポーツ活動を制限するルールは相容れません。
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
