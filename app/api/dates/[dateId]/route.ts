import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { getAuthOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";

type Params = { groupId: string; memberId: string };

export async function DELETE(
  request: NextRequest,
  context: { params: Promise<Params> }
) {
  try {
    const { groupId, memberId } = await context.params; // 非同期に `params` を取得

    if (!groupId || !memberId) {
      return NextResponse.json(
        { error: "Invalid groupId or memberId" },
        { status: 400 }
      );
    }

    const session = await getServerSession(getAuthOptions());
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await prisma.groupMembership.delete({
      where: {
        userId_groupId: { userId: memberId, groupId: groupId },
      },
    });

    return NextResponse.json({ message: "Member removed successfully" });
  } catch (error) {
    console.error("DELETE Error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
