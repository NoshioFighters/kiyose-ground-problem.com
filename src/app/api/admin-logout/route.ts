import { NextResponse } from "next/server";
import { publicRedirectUrl } from "@/lib/request-public-origin";

export const dynamic = "force-dynamic";

const COOKIE_NAME = "admin_token";

export async function POST(req: Request) {
  const res = NextResponse.redirect(
    publicRedirectUrl("/admin/login", req.headers, req.url)
  );
  res.cookies.set(COOKIE_NAME, "", {
    httpOnly: true,
    sameSite: "strict",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 0,
  });
  return res;
}
