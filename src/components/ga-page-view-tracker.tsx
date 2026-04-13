"use client";

import { usePathname, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useRef } from "react";

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
  }
}

function GaPageViewTrackerInner({ gaId }: { gaId: string }) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const isFirstNavigation = useRef(true);

  useEffect(() => {
    if (!gaId) return;
    if (isFirstNavigation.current) {
      isFirstNavigation.current = false;
      return;
    }
    const q = searchParams.toString();
    const pagePath = q ? `${pathname}?${q}` : pathname;
    window.gtag?.("config", gaId, {
      page_path: pagePath,
    });
  }, [gaId, pathname, searchParams]);

  return null;
}

export function GaPageViewTracker({ gaId }: { gaId: string }) {
  return (
    <Suspense fallback={null}>
      <GaPageViewTrackerInner gaId={gaId} />
    </Suspense>
  );
}
