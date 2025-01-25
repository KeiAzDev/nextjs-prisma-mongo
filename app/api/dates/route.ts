// app/api/dates/route.ts
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { getAuthOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";

export async function POST(request: Request) {
  const session = await getServerSession(getAuthOptions());

  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { selections, email } = await request.json();

    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) throw new Error("User not found");

    await prisma.userDate.createMany({
      data: selections.map((selection: { date: string; memo: string }) => ({
        date: new Date(selection.date),  // タイムゾーン調整を削除
        memo: selection.memo,
        userId: user.id
      }))
    });

    // 最新の日付一覧を取得して返す
    const updatedUser = await prisma.user.findUnique({
      where: { email },
      include: { dates: true },
    });

    return NextResponse.json({
      success: true,
      dates: updatedUser?.dates,
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to update dates" },
      { status: 500 }
    );
  }
}
