import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { openai } from "@/lib/openai";
import { prisma } from "@/lib/prisma";
import { BODY_ANALYSIS_PROMPT } from "@/lib/prompts";

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

    // GPT-4o Vision으로 체형 분석
    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "user",
          content: [
            { type: "text", text: BODY_ANALYSIS_PROMPT },
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
      max_tokens: 1000,
      response_format: { type: "json_object" },
    });

    const content = response.choices[0]?.message?.content;
    if (!content) {
      return NextResponse.json({ error: "AI 분석 실패" }, { status: 500 });
    }

    const analysis = JSON.parse(content);

    // DB에 체형 정보 저장
    await prisma.user.update({
      where: { id: session.user.id },
      data: { bodyType: analysis.bodyType },
    });

    return NextResponse.json(analysis);
  } catch (error) {
    console.error("체형 분석 오류:", error);
    return NextResponse.json({ error: "분석 중 오류가 발생했습니다" }, { status: 500 });
  }
}
