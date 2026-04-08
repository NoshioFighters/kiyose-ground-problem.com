/**
 * LP 用セクションの共通ラッパー。
 * 余白・幅・下線・背景だけここで固定し、本文編集でレイアウトが崩れにくくします。
 *
 * ルートの `main` クラスは `@/lib/lp-layout` の `lpRootMainClass` と揃えること。
 */
import { forwardRef, type ReactNode } from "react";
import { cn } from "@/lib/cn";

/** セクション外枠（背景は tone で上書き） */
export const landingSectionFrame =
  "w-full min-w-0 max-w-full border-b border-border px-4 py-14 sm:py-16";

const toneClass = {
  white: "bg-white text-body",
  surface: "bg-surface text-body",
} as const;

export type LandingSectionTone = keyof typeof toneClass;

type Props = {
  tone: LandingSectionTone;
  /** アクセシビリティ用（見出し id と対応） */
  "aria-labelledby": string;
  id?: string;
  className?: string;
  children: ReactNode;
};

export const LandingSection = forwardRef<HTMLElement, Props>(
  function LandingSection(
    { tone, id, "aria-labelledby": labelledBy, className, children },
    ref
  ) {
    return (
      <section
        ref={ref}
        id={id}
        aria-labelledby={labelledBy}
        className={cn(landingSectionFrame, toneClass[tone], className)}
      >
        {children}
      </section>
    );
  }
);

LandingSection.displayName = "LandingSection";

/** 各セクションの h2 を揃える */
export const lpSectionTitleClass =
  "text-center text-2xl font-bold text-body sm:text-3xl";
