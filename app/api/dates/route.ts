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

    await prisma.$transaction(async (prisma) => {
      const user = await prisma.user.findUnique({
        where: { email },
      });

      if (!user) {
        throw new Error("User not found");
      }

      await prisma.userDate.deleteMany({
        where: { userId: user.id },
      });

      // 修正したcreateMany
      await prisma.userDate.createMany({
        data: selections.map((selection: { date: string; memo: string }) => ({
          date: new Date(selection.date),
          memo: selection.memo,
          userId: user.id,
        })),
      });
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error:", error);
    return NextResponse.json(
      { error: "Failed to update dates" },
      { status: 500 }
    );
  }
}
