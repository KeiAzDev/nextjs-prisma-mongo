// app/api/groups/[groupId]/route.ts
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import prisma from "@/lib/prisma";
import { getAuthOptions } from "@/lib/auth";

export async function DELETE(req: Request) {
  const session = await getServerSession(getAuthOptions());
  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    // URLからgroupIdを取得
    const groupId = req.url.split("/groups/")[1];

    const group = await prisma.group.findUnique({
      where: { id: groupId },
      include: { owner: true },
    });

    if (!group) {
      return NextResponse.json({ error: "Group not found" }, { status: 404 });
    }

    if (group.owner.email !== session.user.email) {
      return NextResponse.json(
        { error: "Only the group owner can delete the group" },
        { status: 403 }
      );
    }

    await prisma.group.delete({
      where: { id: groupId },
    });

    return NextResponse.json({ success: true });
  } catch (error: Error | unknown) {
    console.error("Error deleting group:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "An error occurred" },
      { status: 500 }
    );
  }
}
