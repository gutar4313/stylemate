import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { openai } from "@/lib/openai";
import { prisma } from "@/lib/prisma";
import { buildRecommendPrompt } from "@/lib/prompts";
import { searchNaverShopping, cleanHtml } from "@/lib/naver-shopping";

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "로그인이 필요합니다" }, { status: 401 });
  }

  try {
    // 사용자 프로필 가져오기
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      include: { preferences: true },
    });

    if (!user) {
      return NextResponse.json({ error: "사용자를 찾을 수 없습니다" }, { status: 404 });
    }

    // AI 코디 추천 요청
    const prompt = buildRecommendPrompt({
      gender: user.gender,
      height: user.height,
      weight: user.weight,
      bodyType: user.bodyType,
      topSize: user.topSize,
      bottomSize: user.bottomSize,
      styles: user.preferences.map((p) => p.tag),
    });

    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [{ role: "user", content: prompt }],
      max_tokens: 2000,
      response_format: { type: "json_object" },
    });

    const content = response.choices[0]?.message?.content;
    if (!content) {
      return NextResponse.json({ error: "AI 추천 실패" }, { status: 500 });
    }

    const { recommendations } = JSON.parse(content);

    // 각 아이템에 네이버 쇼핑 상품 매칭
    const enrichedRecommendations = await Promise.all(
      recommendations.map(async (rec: Record<string, unknown>, idx: number) => {
        const items = rec.items as Array<{ searchKeyword: string; name: string; category: string; color: string; fit: string }>;
        const enrichedItems = await Promise.all(
          items.map(async (item) => {
            const shopItems = await searchNaverShopping(item.searchKeyword, 3);
            return {
              ...item,
              products: shopItems.map((s) => ({
                title: cleanHtml(s.title),
                image: s.image,
                price: Number(s.lprice),
                link: s.link,
                mall: s.mallName,
              })),
            };
          })
        );

        return {
          id: `rec-${Date.now()}-${idx}`,
          ...rec,
          items: enrichedItems,
        };
      })
    );

    // 추천 이력 저장
    await prisma.outfitRecommendation.create({
      data: {
        userId: session.user.id,
        prompt,
        result: enrichedRecommendations,
        items: enrichedRecommendations,
      },
    });

    return NextResponse.json({ recommendations: enrichedRecommendations });
  } catch (error) {
    console.error("코디 추천 오류:", error);
    return NextResponse.json({ error: "추천 중 오류가 발생했습니다" }, { status: 500 });
  }
}
