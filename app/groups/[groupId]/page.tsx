// app/groups/[groupId]/page.tsx
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { getAuthOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import Link from "next/link";
import NavigationHeader from "@/app/components/NavigationHeader";
import DeleteGroupButton from "@/app/components/DeleteGroupButton";
import RemoveMemberButton from "@/app/components/RemoveMemberButton";

// Add this function to format dates consistently
const formatJapanDate = (date: string | Date) => {
  return new Date(date).toLocaleString("ja-JP", {
    timeZone: "Asia/Tokyo",
    year: "numeric",
    month: "long",
    day: "numeric",
    weekday: "long",
  });
};

type PageProps = {
  params: Promise<{ groupId: string }>;
};

export default async function GroupDetailPage(props: PageProps) {
  const { groupId } = await props.params;
  const session = await getServerSession(getAuthOptions());

  if (!session?.user) redirect("/");

  const group = await prisma.group.findUnique({
    where: { id: groupId },
    include: {
      owner: true,
      memberships: {
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
              dates: true,
            },
          },
        },
      },
    },
  });

  const isMember = group?.memberships.some(
    (membership) => membership.user.id === session.user.id
  );

  if (!group || !isMember) {
    redirect("/groups");
  }

  const isOwner = group.owner.email === session.user.email;

  const memberDates = group.memberships.map((membership) => ({
    userId: membership.user.id,
    userName: membership.user.name || "名無し",
    dates: membership.user.dates || [],
  }));

  return (
    <div className="min-h-screen bg-gray-50">
      <NavigationHeader userName={session.user.name || "名無しさん"} />

      <main className="max-w-4xl mx-auto p-8">
        <div className="mb-8">
          <div className="flex items-center gap-4">
            <Link href="/groups" className="text-gray-500 hover:text-gray-700">
              ← グループ一覧に戻る
            </Link>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6 mb-8">
          <div className="mb-6">
            <h1 className="text-2xl font-bold mb-2">{group.name}</h1>
            {group.description && (
              <p className="text-gray-600">{group.description}</p>
            )}
          </div>

          <div className="border-t pt-6">
            <h2 className="text-lg font-semibold mb-4">メンバー一覧</h2>
            <div className="grid gap-2">
            {group.memberships.map((membership) => (
  <div key={membership.user.id} className="flex items-center justify-between py-2">
    <div className="flex items-center gap-2">
      <span>{membership.user.name}</span>
      {membership.user.id === group.owner.id && (
        <span className="text-sm text-gray-500">(作成者)</span>
      )}
    </div>
    {isOwner && membership.user.id !== group.owner.id && (
  <RemoveMemberButton groupId={group.id} memberId={membership.user.id} />
)}
  </div>
))}
            </div>
          </div>

          <div className="border-t pt-6 mt-6">
            <h2 className="text-lg font-semibold mb-4">各個人の希望日</h2>
            {memberDates.some((member) => member.dates.length > 0) ? (
              <div className="space-y-4">
                {memberDates.map((member) => (
                  <div key={member.userId} className="bg-gray-50 p-4 rounded">
                    <h3 className="font-medium mb-2">
                      {member.userName}の希望日
                    </h3>
                    {member.dates.length > 0 ? (
                      <div className="grid gap-2">
                        {member.dates
                          .sort(
                            (a, b) =>
                              new Date(a.date).getTime() -
                              new Date(b.date).getTime()
                          )
                          .map((date) => (
                            <div
                              key={date.id}
                              className="bg-white p-2 rounded border flex justify-between"
                            >
                              <span>
                                {formatJapanDate(date.date)}
                              </span>
                              <span className="text-gray-600">{date.memo}</span>
                            </div>
                          ))}
                      </div>
                    ) : (
                      <p className="text-gray-500">
                        まだ日付が登録されていません
                      </p>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500">まだ日付が登録されていません</p>
            )}
          </div>

          {isOwner && (
            <div className="border-t pt-6 mt-6">
              <h2 className="text-lg font-semibold mb-4">グループ管理</h2>
              <div className="space-y-6">
                <div className="bg-gray-50 p-4 rounded">
                  <h3 className="font-medium mb-2">招待コード</h3>
                  <div className="flex items-center gap-4">
                    <code className="bg-white px-4 py-2 rounded border">
                      {group.inviteCode}
                    </code>
                    <p className="text-sm text-gray-500">
                      このコードを共有してメンバーを招待できます
                    </p>
                  </div>
                </div>

                <div className="bg-gray-50 p-4 rounded">
                  <h3 className="font-medium mb-2 text-red-600">危険な操作</h3>
                  <div>
                    <p className="text-sm text-gray-600 mb-4">
                      グループを削除すると、すべてのメンバーシップと関連データが完全に削除されます。
                      この操作は取り消すことができません。
                    </p>
                    <DeleteGroupButton groupId={group.id} />
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}