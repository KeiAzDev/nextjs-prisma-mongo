// app/api/groups/route.ts
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { getAuthOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";

function generateInviteCode() {
  return Math.random().toString(36).substring(2, 8).toUpperCase();
}

export async function GET() {
  const session = await getServerSession(getAuthOptions());
  
  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const groups = await prisma.group.findMany({
      where: {
        OR: [
          { ownerId: session.user.id },
          {
            memberships: {
              some: {
                user: {
                  email: session.user.email
                }
              }
            }
          }
        ]
      },
      include: {
        owner: true,
        memberships: {
          include: {
            user: true
          }
        }
      }
    });

    return NextResponse.json(groups);
  } catch (error) {
    console.error("Error fetching groups:", error);
    return NextResponse.json(
      { error: "Failed to fetch groups" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  const session = await getServerSession(getAuthOptions());
  
  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { name, description } = await request.json();

    // ユーザーを取得
    const user = await prisma.user.findUnique({
      where: { email: session.user.email }
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // グループを作成
    const group = await prisma.group.create({
      data: {
        name,
        description,
        inviteCode: generateInviteCode(),
        ownerId: user.id,
        memberships: {
          create: {
            userId: user.id
          }
        }
      },
      include: {
        owner: true,
        memberships: {
          include: {
            user: true
          }
        }
      }
    });

    return NextResponse.json(group);
  } catch (error) {
    console.error("Error creating group:", error);
    return NextResponse.json(
      { error: "Failed to create group" },
      { status: 500 }
    );
  }
}