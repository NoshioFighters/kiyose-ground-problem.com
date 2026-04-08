import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

function isAdminLoginPath(pathname: string): boolean {
  return (
    pathname === "/admin/login" ||
    pathname.startsWith("/admin/login/")
  );
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

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
  matcher: ["/admin/:path*", "/api/admin/:path*"],
};
