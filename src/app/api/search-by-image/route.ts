import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { openai } from "@/lib/openai";
import { IMAGE_SEARCH_PROMPT } from "@/lib/prompts";
import { searchNaverShopping, cleanHtml } from "@/lib/naver-shopping";

export async function POST(request: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "로그인이 필요합니다" }, { status: 401 });
  }

  const formData = await request.formData();
  const image = formData.get("image") as File | null;

  if (!image) {
    return NextResponse.json({ error: "이미지가 필요합니다" }, { status: 400 });
  }

  try {
    // 이미지를 base64로 변환
    const bytes = await image.arrayBuffer();
    const base64 = Buffer.from(bytes).toString("base64");
    const mimeType = image.type || "image/jpeg";

    // GPT-4o Vision으로 이미지 분석
    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "user",
          content: [
            { type: "text", text: IMAGE_SEARCH_PROMPT },
            {
              type: "image_url",
              image_url: {
                url: `data:${mimeType};base64,${base64}`,
                detail: "high",
              },
            },
          ],
        },
      ],
      max_tokens: 1500,
      response_format: { type: "json_object" },
    });

    const content = response.choices[0]?.message?.content;
    if (!content) {
      return NextResponse.json({ error: "이미지 분석 실패" }, { status: 500 });
    }

    const analysis = JSON.parse(content);

    // 각 아이템에 대해 네이버 쇼핑 검색
    const enrichedItems = await Promise.all(
      analysis.items.map(async (item: { searchKeyword: string; name: string; category: string; color: string; style: string; material: string }) => {
        const shopItems = await searchNaverShopping(item.searchKeyword, 4);
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

    return NextResponse.json({
      results: [
        {
          id: `search-${Date.now()}`,
          title: analysis.overallStyle,
          description: `${analysis.items.length}개의 아이템이 감지되었습니다`,
          items: enrichedItems,
          tags: analysis.tags,
        },
      ],
    });
  } catch (error) {
    console.error("이미지 검색 오류:", error);
    return NextResponse.json({ error: "검색 중 오류가 발생했습니다" }, { status: 500 });
  }
}
