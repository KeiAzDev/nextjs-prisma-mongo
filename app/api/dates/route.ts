// app/api/dates/route.ts
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function POST(request: Request) {
  const session = await getServerSession();
  
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { dates, email } = await request.json();
    
    const user = await prisma.user.update({
      where: { email },
      data: {
        dates: dates.map((date: string) => new Date(date)),
      },
    });

    return NextResponse.json(user);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to update dates" },
      { status: 500 }
    );
  }
}