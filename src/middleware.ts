import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

function isAdminLoginPath(pathname: string): boolean {
  return (
    pathname === "/admin/login" ||
    pathname.startsWith("/admin/login/")
  );
}

function isMaintenanceMode(): boolean {
  const v = process.env.MAINTENANCE_MODE?.trim().toLowerCase();
  return v === "1" || v === "true" || v === "yes";
}

/** メンテ中でもアセット・メンテページ・管理画面は通す */
function isMaintenanceBypass(pathname: string): boolean {
  if (pathname === "/maintenance") return true;
  if (pathname.startsWith("/_next/")) return true;
  if (pathname === "/favicon.ico") return true;
  if (pathname.startsWith("/admin")) return true;
  if (pathname.startsWith("/api/admin")) return true;
  return false;
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (isMaintenanceMode()) {
    if (!isMaintenanceBypass(pathname)) {
      if (pathname.startsWith("/api/")) {
        return NextResponse.json(
          { error: "メンテナンス中です。しばらくしてからお試しください。" },
          { status: 503 }
        );
      }
      const url = request.nextUrl.clone();
      url.pathname = "/maintenance";
      url.search = "";
      return NextResponse.redirect(url);
    }
  }

  /** ログイン画面は常に通す（末尾スラッシュやマッチャーの解釈差で誤認証しない） */
  if (isAdminLoginPath(pathname)) {
    return NextResponse.next();
  }

  const isAdminPage = pathname.startsWith("/admin");
  const isAdminApi = pathname.startsWith("/api/admin/");

  if (!isAdminPage && !isAdminApi) {
    return NextResponse.next();
  }

  const adminPassword = process.env.ADMIN_PASSWORD;
  const token = request.cookies.get("admin_token");
  if (!adminPassword || !token || token.value !== adminPassword) {
    if (isAdminApi) {
      return NextResponse.json({ error: "認証が必要です。" }, { status: 401 });
    }
    return NextResponse.redirect(new URL("/admin/login", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|_next/webpack-hmr|favicon.ico).*)",
  ],
};
