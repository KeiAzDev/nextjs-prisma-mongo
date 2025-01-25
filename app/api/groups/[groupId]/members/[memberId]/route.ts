// app/api/groups/[groupId]/members/[memberId]/route.ts
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { getAuthOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";

export async function DELETE(
  request: Request,
  { params }: { params: { groupId: string, memberId: string } }
) {
  const session = await getServerSession(getAuthOptions());
  
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const group = await prisma.group.findUnique({
      where: { id: params.groupId },
      include: { owner: true }
    });
  
    if (!group || group.owner.email !== session.user.email) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }
  
    await prisma.groupMembership.delete({
      where: {
        userId_groupId: {
          userId: params.memberId,
          groupId: params.groupId
        }
      }
    });
  
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Failed to remove member" }, { status: 500 });
  }
}