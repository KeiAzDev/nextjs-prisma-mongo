// app/components/LoginButton.tsx
"use client";
import { signIn } from "next-auth/react";

export default function LoginButton() {
  return (
    <button
      onClick={() => signIn("google")}
      className="flex items-center justify-center gap-2 px-6 py-3 w-full bg-white border rounded-lg hover:bg-gray-50 transition-colors"
    >
      Googleでログイン
    </button>
  );
}