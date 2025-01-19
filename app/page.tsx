// app/page.tsx
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "./api/auth/[...nextauth]/route";
import LoginButton from "./components/LoginButton";

export default async function Home() {
  // authOptionsを引数として渡す
  const session = await getServerSession(authOptions);
  
  if (session) {
    redirect("/select-dates");
  }

  return (
    <main className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full p-8 bg-white rounded-lg shadow-lg">
        <h1 className="text-2xl font-bold text-center mb-8">
          日付選択アプリへようこそ
        </h1>
        <div className="text-center">
          <LoginButton />
        </div>
      </div>
    </main>
  );
}
