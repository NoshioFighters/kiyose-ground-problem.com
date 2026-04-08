/** 条件付き class 結合（Tailwind の重複・undefined を整理） */
export function cn(
  ...parts: Array<string | undefined | null | false>
): string {
  return parts.filter(Boolean).join(" ");
}
