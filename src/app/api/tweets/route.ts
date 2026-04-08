import { NextResponse } from "next/server";
import { getTweetsForLp } from "@/lib/tweets-lp";

export const dynamic = "force-dynamic";

export async function GET() {
  const payload = await getTweetsForLp();
  return NextResponse.json(payload);
}
