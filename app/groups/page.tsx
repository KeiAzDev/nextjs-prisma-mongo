// app/groups/page.tsx
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import prisma from "@/lib/prisma";
import Link from "next/link";
import GroupJoinForm from "@/app/components/GroupJoinForm";
import NavigationHeader from "@/app/components/NavigationHeader";

export default async function GroupsPage() {
  const session = await getServerSession(authOptions);
  
  if (!session?.user) {
    redirect("/");
  }

  // グループデータの取得方法を修正
  const groups = await prisma.group.findMany({
    where: {
      OR: [
        { ownerId: session.user.id },
        {
          memberships: {
            some: {
              userId: session.user.id
            }
          }
        }
      ]
    },
    include: {
      owner: {
        select: {
          id: true,
          name: true,
          email: true
        }
      },
      memberships: {
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true
            }
          }
        }
      }
    }
  });

  return (
    <div className="min-h-screen bg-gray-50">
      <NavigationHeader userName={session.user.name || "名無しさん"} />
      
      <main className="max-w-4xl mx-auto p-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-bold">マイグループ</h1>
          <Link 
            href="/groups/create"
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            新規グループ作成
          </Link>
        </div>

        <div className="space-y-6">
          {groups.map((group) => (
            <div
              key={group.id}
              className="bg-white p-6 rounded-lg shadow"
            >
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h2 className="text-xl font-semibold">{group.name}</h2>
                  {group.description && (
                    <p className="text-gray-600 mt-1">{group.description}</p>
                  )}
                </div>
                <Link
                  href={`/groups/${group.id}`}
                  className="text-blue-500 hover:text-blue-700"
                >
                  詳細を見る
                </Link>
              </div>

              <div className="flex justify-between items-center text-sm text-gray-500">
                <div>
                  メンバー: {group.memberships.length}人
                </div>
                <div>
                  作成者: {group.owner?.name || "不明"}
                </div>
              </div>
            </div>
          ))}

          {groups.length === 0 && (
            <p className="text-center text-gray-500 py-8">
              まだグループに参加していません
            </p>
          )}
        </div>

        <div className="mt-12 bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">グループに参加</h2>
          <GroupJoinForm />
        </div>
      </main>
    </div>
  );
}