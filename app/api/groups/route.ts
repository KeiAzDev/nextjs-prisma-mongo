// app/api/groups/route.ts
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { getAuthOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { randomBytes } from "crypto";

export async function POST(request: Request) {
  try {
    const session = await getServerSession(getAuthOptions());
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const json = await request.json();
    if (!json || !json.name) {
      return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
    }

    const { name, description } = json;

    const user = await prisma.user.findUnique({
      where: { email: session.user.email }
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const group = await prisma.group.create({
      data: {
        name,
        description,
        inviteCode: randomBytes(3).toString('hex').toUpperCase(),
        ownerId: user.id,
        memberships: {
          create: {
            userId: user.id
          }
        }
      },
      include: {
        owner: true,
        memberships: true
      }
    });

    return NextResponse.json({ data: group });
  } catch (error) {
    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    return NextResponse.json(
      { error: "グループの作成に失敗しました" },
      { status: 500 }
    );
  }
}