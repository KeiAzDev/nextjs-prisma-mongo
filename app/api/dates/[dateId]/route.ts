import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { getAuthOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";

interface Params {
  dateId: string;
  [Symbol.toStringTag]: string;
}

interface Context extends Promise<void> {
  params: Params;
}

export async function DELETE(
  request: NextRequest,
  context: Context
) {
  const session = await getServerSession(getAuthOptions());
  
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    await prisma.userDate.delete({
      where: { id: context.params.dateId }
    });
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Error:", err);
    return NextResponse.json({ error: "Failed to delete date" }, { status: 500 });
  }
}