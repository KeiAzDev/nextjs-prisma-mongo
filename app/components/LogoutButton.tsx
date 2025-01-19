// app/components/LogoutButton.tsx
"use client";
import { signOut } from "next-auth/react";

export default function LogoutButton() {
  return (
    <button
      onClick={() => signOut({ callbackUrl: "/" })}
      className="px-4 py-2 text-sm text-red-600 hover:bg-red-50 rounded-md transition-colors"
    >
      ログアウト
    </button>
  );
}