// app/groups/create/page.tsx
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import GroupCreateForm from "@/app/components/GroupCreateForm";
import NavigationHeader from "@/app/components/NavigationHeader";

export default async function CreateGroupPage() {
  const session = await getServerSession(authOptions);
  
  if (!session?.user) {
    redirect("/");
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <NavigationHeader userName={session.user.name || "名無しさん"} />
      
      <main className="max-w-2xl mx-auto p-8">
        <h1 className="text-2xl font-bold mb-8">新規グループ作成</h1>
        <div className="bg-white rounded-lg shadow p-6">
          <GroupCreateForm />
        </div>
      </main>
    </div>
  );
}