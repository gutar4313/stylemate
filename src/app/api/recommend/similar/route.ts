import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { openai } from "@/lib/openai";
import { prisma } from "@/lib/prisma";

// 저장된 코디 기반 비슷한 스타일 추천
export async function GET() {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "로그인이 필요합니다" }, { status: 401 });
  }

  const saved = await prisma.savedOutfit.findMany({
    where: { userId: session.user.id },
    orderBy: { savedAt: "desc" },
    take: 5,
  });

  if (saved.length === 0) {
    return NextResponse.json({ error: "저장된 코디가 없습니다" }, { status: 400 });
  }

  const savedSummary = saved
    .map((o) => `- ${o.title}: ${(o.tags as string[]).join(", ")}`)
    .join("\n");

  const prompt = `당신은 한국 패션 전문 스타일리스트입니다.
사용자가 좋아한 코디 목록입니다:
${savedSummary}

이 취향을 바탕으로 비슷하지만 새로운 코디 3가지를 추천해주세요.
2025-2026 한국 트렌드를 반영하고, 각 코디는 상의/하의/신발/액세서리로 구성해주세요.

반드시 아래 JSON 형식으로만 응답해주세요:
{
  "recommendations": [
    {
      "title": "코디 제목",
      "description": "코디 설명",
      "items": [
        {"name": "아이템명", "category": "상의", "color": "색상", "searchKeyword": "네이버 검색어"}
      ],
      "tags": ["태그1", "태그2"],
      "occasion": "착용 상황"
    }
  ]
}`;

  const response = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [{ role: "user", content: prompt }],
    max_tokens: 1500,
    response_format: { type: "json_object" },
  });

  const content = response.choices[0]?.message?.content;
  if (!content) {
    return NextResponse.json({ error: "추천 실패" }, { status: 500 });
  }

  const { recommendations } = JSON.parse(content);
  return NextResponse.json({
    recommendations: recommendations.map((r: unknown, i: number) => ({
      id: `similar-${Date.now()}-${i}`,
      ...(r as object),
    })),
  });
}
