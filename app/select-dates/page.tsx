import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { getAuthOptions } from "@/lib/auth";
import DateSelectionForm from "../components/DeleteSelectionForm";
import NavigationHeader from "../components/NavigationHeader";
import prisma from "@/lib/prisma";

export default async function SelectDates() {
  const session = await getServerSession(getAuthOptions());
  if (!session?.user) redirect("/");

  const user = await prisma.user.findUnique({
    where: { email: session.user.email! },
    include: {
      // selectからincludeに変更
      dates: true,
    },
  });

  if (!user) redirect("/");

  return (
    <div className="min-h-screen bg-gray-50">
      <NavigationHeader userName={user.name || "名無しさん"} />
      <main className="max-w-4xl mx-auto p-8">
        <div className="bg-white rounded-lg shadow p-6">
          <h1 className="text-2xl font-bold mb-8">マイ日付</h1>
          <div className="mb-8">
            <h2 className="text-lg font-medium mb-4">保存済みの日付</h2>
            {user.dates.length > 0 ? (
              <div className="grid gap-2">
                {user.dates.map((date) => (
                  <div
                    key={date.id}
                    className="bg-gray-50 p-3 rounded flex justify-between"
                  >
                    <span>
                      {new Date(date.date).toLocaleDateString("ja-JP", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                        weekday: "long",
                      })}
                    </span>
                    <span className="text-gray-600">{date.memo}</span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500">まだ日付が選択されていません</p>
            )}
          </div>
          <div className="border-t pt-8">
            <h2 className="text-lg font-medium mb-4">新しい日付を選択</h2>
            {user.email && (
              <DateSelectionForm
                initialDates={user.dates.map((d) => d.date)}
                userEmail={user.email}
              />
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
