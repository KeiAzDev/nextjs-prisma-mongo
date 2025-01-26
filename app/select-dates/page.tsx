// app/select-dates/page.tsx
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { getAuthOptions } from "@/lib/auth";
import DateSelectionForm from "../components/DateSelectionForm";
import NavigationHeader from "../components/NavigationHeader";
import prisma from "@/lib/prisma";

export default async function SelectDates() {
  const session = await getServerSession(getAuthOptions());
  if (!session?.user) redirect("/");

  const user = await prisma.user.findUnique({
    where: { email: session.user.email! },
    include: {
      dates: true,
    },
  });

  if (!user) redirect("/");

  return (
    <div className="min-h-screen bg-gray-50 pt-16">
      <NavigationHeader userName={user.name || "名無しさん"} />
      <main className="max-w-4xl mx-auto p-8">
        <div className="bg-white rounded-lg shadow p-6">
          <h1 className="text-2xl font-bold mb-8">マイ日付</h1>
          {user.email && (
            <DateSelectionForm savedDates={user.dates} userEmail={user.email} />
          )}
        </div>
      </main>
    </div>
  );
}
