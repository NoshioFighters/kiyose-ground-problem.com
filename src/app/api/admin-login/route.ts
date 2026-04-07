import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

const COOKIE_NAME = "admin_token";

export async function POST(req: Request) {
  const adminPassword = process.env.ADMIN_PASSWORD;
  if (!adminPassword) {
    return NextResponse.redirect(new URL("/admin/login?error=server", req.url));
  }

  let password = "";
  const contentType = req.headers.get("content-type") ?? "";
  if (contentType.includes("application/json")) {
    try {
      const body = (await req.json()) as { password?: string };
      password = typeof body.password === "string" ? body.password : "";
    } catch {
      password = "";
    }
  } else {
    const form = await req.formData();
    password = String(form.get("password") ?? "");
  }

  if (password !== adminPassword) {
    return NextResponse.redirect(new URL("/admin/login?error=auth", req.url));
  }

  const res = NextResponse.redirect(new URL("/admin", req.url));
  res.cookies.set(COOKIE_NAME, adminPassword, {
    httpOnly: true,
    sameSite: "strict",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  });
  return res;
}
