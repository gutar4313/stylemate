import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { writeFile, mkdir } from "fs/promises";
import path from "path";

export async function POST(request: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "로그인이 필요합니다" }, { status: 401 });
  }

  const formData = await request.formData();
  const bodyPhoto = formData.get("bodyPhoto") as File | null;
  const gender = formData.get("gender") as string;
  const height = formData.get("height") as string;
  const weight = formData.get("weight") as string;
  const topSize = formData.get("topSize") as string;
  const bottomSize = formData.get("bottomSize") as string;
  const shoeSize = formData.get("shoeSize") as string;
  const styles = JSON.parse((formData.get("styles") as string) || "[]");

  let bodyPhotoUrl: string | undefined;

  // 사진 저장
  if (bodyPhoto) {
    const uploadsDir = path.join(process.cwd(), "public", "uploads");
    await mkdir(uploadsDir, { recursive: true });
    const ext = bodyPhoto.name.split(".").pop();
    const filename = `${session.user.id}-body.${ext}`;
    const filepath = path.join(uploadsDir, filename);
    const bytes = await bodyPhoto.arrayBuffer();
    await writeFile(filepath, Buffer.from(bytes));
    bodyPhotoUrl = `/uploads/${filename}`;
  }

  // 프로필 업데이트
  await prisma.user.update({
    where: { id: session.user.id },
    data: {
      gender,
      height: height ? parseFloat(height) : null,
      weight: weight ? parseFloat(weight) : null,
      topSize: topSize || null,
      bottomSize: bottomSize || null,
      shoeSize: shoeSize || null,
      ...(bodyPhotoUrl && { bodyPhotoUrl }),
    },
  });

  // 스타일 선호도 업데이트
  if (styles.length > 0) {
    await prisma.stylePreference.deleteMany({
      where: { userId: session.user.id },
    });
    await prisma.stylePreference.createMany({
      data: styles.map((tag: string) => ({
        userId: session.user.id,
        tag,
        score: 1.0,
      })),
    });
  }

  return NextResponse.json({ success: true });
}

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "로그인이 필요합니다" }, { status: 401 });
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    include: { preferences: true },
  });

  return NextResponse.json(user);
}
