// app/api/groups/join/route.ts
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { getAuthOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";

export async function POST(request: Request) {
  const session = await getServerSession(getAuthOptions());

  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { inviteCode } = await request.json();

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const group = await prisma.group.findUnique({
      where: { inviteCode },
    });

    if (!group) {
      return NextResponse.json(
        { error: "グループが見つかりません" },
        { status: 404 }
      );
    }

    const existingMembership = await prisma.groupMembership.findFirst({
      where: {
        userId: user.id,
        groupId: group.id,
      },
    });

    if (existingMembership) {
      return NextResponse.json(
        { error: "既にグループのメンバーです" },
        { status: 400 }
      );
    }

    // 既存の希望日を削除
    await prisma.userDate.deleteMany({
      where: { userId: user.id },
    });

    // グループメンバーシップを作成
    const membership = await prisma.groupMembership.create({
      data: {
        userId: user.id,
        groupId: group.id,
      },
    });

    return NextResponse.json(membership);
  } catch (error) {
    console.error("Error joining group:", error);
    return NextResponse.json(
      { error: "グループへの参加に失敗しました" },
      { status: 500 }
    );
  }
}
