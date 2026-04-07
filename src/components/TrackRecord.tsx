"use client";

import { useEffect, useRef, useState } from "react";

function useAnimatedNumber(target: number, durationMs: number, enabled: boolean) {
  const [value, setValue] = useState(0);
  const startRef = useRef<number | null>(null);

  useEffect(() => {
    if (!enabled) {
      setValue(target);
      return;
    }
    setValue(0);
    startRef.current = null;
    let frame: number;

    const tick = (now: number) => {
      if (startRef.current === null) startRef.current = now;
      const t = Math.min(1, (now - startRef.current) / durationMs);
      const eased = 1 - (1 - t) ** 3;
      setValue(Math.round(target * eased));
      if (t < 1) frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [target, durationMs, enabled]);

  return value;
}

export function TrackRecord() {
  const [visible, setVisible] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => {
        if (e?.isIntersecting) setVisible(true);
      },
      { threshold: 0.2 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  const signatures = useAnimatedNumber(1042, 1600, visible);
  const groups = useAnimatedNumber(7, 1200, visible);

  return (
    <section
      ref={sectionRef}
      className="border-b border-border bg-white px-4 py-14 sm:py-16"
      aria-labelledby="track-heading"
    >
      <div className="mx-auto max-w-4xl">
        <h2
          id="track-heading"
          className="text-center text-2xl font-bold text-body sm:text-3xl"
        >
          みなさんの声が集まっています
        </h2>
        <div className="mt-12 grid gap-8 sm:grid-cols-3">
          <div className="text-center">
            <p className="text-4xl font-bold tabular-nums text-accent sm:text-5xl">
              {signatures.toLocaleString("ja-JP")}
            </p>
            <p className="mt-2 text-sm font-medium text-body">名の署名</p>
          </div>
          <div className="text-center">
            <p className="text-4xl font-bold tabular-nums text-body sm:text-5xl">
              {groups}
            </p>
            <p className="mt-2 text-sm font-medium text-body">チーム・団体が賛同</p>
          </div>
          <div className="text-center">
            <p className="text-lg font-bold leading-snug text-body sm:text-xl">
              2026年3月25日
            </p>
            <p className="mt-2 text-sm font-medium text-body">市長へ要望書を提出</p>
          </div>
        </div>
        <div className="mt-10 flex justify-center">
          <span className="inline-flex items-center rounded-full bg-orange-100 px-4 py-2 text-sm font-semibold text-orange-900 ring-1 ring-orange-200">
            現在、市からの回答を待っています
          </span>
        </div>
      </div>
    </section>
  );
}
