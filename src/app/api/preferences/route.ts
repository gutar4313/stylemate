import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

// 선호도 점수 업데이트 (좋아요/싫어요 기반)
export async function POST(request: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "로그인이 필요합니다" }, { status: 401 });
  }

  const { tags, action } = await request.json() as { tags: string[]; action: "like" | "dislike" };
  const delta = action === "like" ? 0.3 : -0.2;

  for (const tag of tags) {
    await prisma.stylePreference.upsert({
      where: { userId_tag: { userId: session.user.id, tag } },
      update: { score: { increment: delta } },
      create: { userId: session.user.id, tag, score: 1.0 + delta },
    });
  }

  return NextResponse.json({ success: true });
}

// 현재 선호도 조회
export async function GET() {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "로그인이 필요합니다" }, { status: 401 });
  }

  const preferences = await prisma.stylePreference.findMany({
    where: { userId: session.user.id },
    orderBy: { score: "desc" },
  });

  return NextResponse.json(preferences);
}
