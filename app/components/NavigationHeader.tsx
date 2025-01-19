// app/components/NavigationHeader.tsx
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import LogoutButton from "./LogoutButton";

type Props = {
  userName: string;
};

export default function NavigationHeader({ userName }: Props) {
  const pathname = usePathname();

  return (
    <header className="bg-white shadow">
      <div className="max-w-4xl mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center gap-8">
            <div>
              <p className="text-sm text-gray-600">ログイン中：</p>
              <p className="font-medium">{userName}</p>
            </div>
            <nav className="flex space-x-4">
              <Link
                href="/select-dates"
                className={`px-3 py-2 rounded-md text-sm font-medium ${
                  pathname === "/select-dates"
                    ? "bg-blue-100 text-blue-700"
                    : "text-gray-700 hover:bg-gray-100"
                }`}
              >
                マイ日付
              </Link>
              <Link
                href="/groups"
                className={`px-3 py-2 rounded-md text-sm font-medium ${
                  pathname.startsWith("/groups")
                    ? "bg-blue-100 text-blue-700"
                    : "text-gray-700 hover:bg-gray-100"
                }`}
              >
                グループ
              </Link>
            </nav>
          </div>
          <LogoutButton />
        </div>
      </div>
    </header>
  );
}