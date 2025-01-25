import { NextRequest } from 'next/server';
import { getServerSession } from 'next-auth';
import { getAuthOptions } from '@/lib/auth';
import prisma from '@/lib/prisma';

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ dateId: string }> } // params を Promise として定義
) {
  try {
    const { dateId } = await params; // params を await で解決

    if (!dateId) {
      return new Response(JSON.stringify({ error: 'Missing dateId' }), { status: 400 });
    }

    const session = await getServerSession(getAuthOptions());
    if (!session?.user) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 });
    }

    await prisma.userDate.delete({
      where: {
        id: dateId,
      },
    });

    return new Response(JSON.stringify({ success: true }), { status: 200 });
  } catch (err) {
    console.error('Error:', err);
    return new Response(JSON.stringify({ error: 'Failed to delete date entry' }), { status: 500 });
  }
}
