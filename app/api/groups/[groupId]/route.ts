// app/api/groups/[groupId]/route.ts
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { getAuthOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";

export async function DELETE(
  request: Request,
  { params }: { params: { groupId: string } }
) {
  const session = await getServerSession(getAuthOptions());
  
  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    // グループを取得して作成者かチェック
    const group = await prisma.group.findUnique({
      where: { id: params.groupId },
      include: { owner: true }
    });

    if (!group) {
      return NextResponse.json(
        { error: "Group not found" },
        { status: 404 }
      );
    }

    if (group.owner.email !== session.user.email) {
      return NextResponse.json(
        { error: "Only the group owner can delete the group" },
        { status: 403 }
      );
    }

    // グループを削除
    await prisma.group.delete({
      where: { id: params.groupId }
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting group:", error);
    return NextResponse.json(
      { error: "Failed to delete group" },
      { status: 500 }
    );
  }
}