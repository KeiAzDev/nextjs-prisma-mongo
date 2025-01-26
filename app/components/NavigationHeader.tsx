"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import LogoutButton from "./LogoutButton";
import { FiMenu } from "react-icons/fi";

type Props = {
  userName: string;
};

export default function NavigationHeader({ userName }: Props) {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="bg-white shadow fixed w-full top-0 z-50">
      <div className="max-w-4xl mx-auto px-4">
        <div className="flex justify-between items-center h-16 relative">
          {/* ログイン情報 */}
          <div>
            <p className="text-sm text-gray-600">ログイン中：</p>
            <p className="font-medium">{userName}</p>
          </div>

          {/* ハンバーガーメニュー（モバイル用） */}
          <div className="md:hidden relative">
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="p-2 text-gray-700 focus:outline-none"
            >
              <FiMenu size={24} />
            </button>

            {/* ドロップダウンメニュー */}
            {menuOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white shadow-lg rounded-md z-50">
                <Link
                  href="/select-dates"
                  className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
                  onClick={() => setMenuOpen(false)}
                >
                  マイ日付
                </Link>
                <Link
                  href="/groups"
                  className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
                  onClick={() => setMenuOpen(false)}
                >
                  グループ
                </Link>
                <div className="border-t mt-2">
                  <LogoutButton />
                </div>
              </div>
            )}
          </div>

          {/* メニューリスト（PC用） */}
          <nav className="hidden md:flex space-x-4">
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
            <LogoutButton />
          </nav>
        </div>
      </div>
    </header>
  );
}
