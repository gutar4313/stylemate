import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

// 저장된 코디 목록 조회
export async function GET() {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "로그인이 필요합니다" }, { status: 401 });
  }

  const favorites = await prisma.savedOutfit.findMany({
    where: { userId: session.user.id },
    orderBy: { savedAt: "desc" },
  });

  return NextResponse.json(favorites);
}

// 코디 저장 (좋아요)
export async function POST(request: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "로그인이 필요합니다" }, { status: 401 });
  }

  const body = await request.json();
  const { title, description, imageUrl, items, tags } = body;

  const saved = await prisma.savedOutfit.create({
    data: {
      userId: session.user.id,
      title,
      description: description || "",
      imageUrl: imageUrl || null,
      items: items || [],
      tags: tags || [],
    },
  });

  return NextResponse.json(saved);
}

// 저장된 코디 삭제
export async function DELETE(request: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "로그인이 필요합니다" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");

  if (!id) {
    return NextResponse.json({ error: "ID가 필요합니다" }, { status: 400 });
  }

  // 본인의 저장 코디만 삭제 가능
  const outfit = await prisma.savedOutfit.findFirst({
    where: { id, userId: session.user.id },
  });

  if (!outfit) {
    return NextResponse.json({ error: "찾을 수 없습니다" }, { status: 404 });
  }

  await prisma.savedOutfit.delete({ where: { id } });

  return NextResponse.json({ success: true });
}
