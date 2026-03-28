import { NextResponse } from "next/server";
import { getNaverShoppingTrends } from "@/lib/naver-datalab";

// 5분 캐시
let cache: { data: unknown; timestamp: number } | null = null;
const CACHE_TTL = 5 * 60 * 1000;

export async function GET() {
  if (cache && Date.now() - cache.timestamp < CACHE_TTL) {
    return NextResponse.json(cache.data);
  }

  const trends = await getNaverShoppingTrends();
  cache = { data: trends, timestamp: Date.now() };
  return NextResponse.json(trends);
}
