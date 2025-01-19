// app/select-dates/page.tsx
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "../api/auth/[...nextauth]/route";
import DateSelectionForm from "../components/DeleteSelectionForm"; 
import LogoutButton from "../components/LogoutButton"; 
import prisma from "@/lib/prisma";

export default async function SelectDates() {
  const session = await getServerSession(authOptions);
  
  if (!session?.user) {
    redirect("/");
  }

  // ユーザーのデータを取得
  const user = await prisma.user.findUnique({
    where: { email: session.user.email! },
    select: {
      name: true,
      email: true,
      dates: true,
    }
  });

  if (!user) {
    redirect("/");
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow">
        <div className="max-w-4xl mx-auto px-4 py-4 flex justify-between items-center">
          <div>
            <p className="text-sm text-gray-600">ログイン中：</p>
            <p className="font-medium">{user.name}</p>
          </div>
          <LogoutButton />
        </div>
      </header>

      <main className="max-w-4xl mx-auto p-8">
        <div className="bg-white rounded-lg shadow p-6">
          <h1 className="text-2xl font-bold mb-8">日付選択</h1>
          
          <div className="mb-8">
            <h2 className="text-lg font-medium mb-4">保存済みの日付</h2>
            {user.dates.length > 0 ? (
              <div className="grid gap-2">
                {user.dates.map((date, index) => (
                  <div key={index} className="bg-gray-50 p-3 rounded">
                    {new Date(date).toLocaleDateString('ja-JP', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                      weekday: 'long'
                    })}
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
                initialDates={user.dates} 
                userEmail={user.email}
              />
            )}
          </div>
        </div>
      </main>
    </div>
  );
}