import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

const COOKIE_NAME = "admin_token";

export async function POST(req: Request) {
  const url = new URL(req.url);
  const res = NextResponse.redirect(new URL("/admin/login", url.origin));
  res.cookies.set(COOKIE_NAME, "", {
    httpOnly: true,
    sameSite: "strict",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 0,
  });
  return res;
}
