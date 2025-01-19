// app/components/GroupJoinForm.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function GroupJoinForm() {
  const [inviteCode, setInviteCode] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    
    try {
      const response = await fetch("/api/groups/join", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ inviteCode: inviteCode.toUpperCase() }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "グループへの参加に失敗しました");
      }

      router.refresh();
      setInviteCode("");
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError("グループへの参加に失敗しました");
      }
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="inviteCode" className="block text-sm font-medium mb-1">
          招待コード
        </label>
        <input
          type="text"
          id="inviteCode"
          value={inviteCode}
          onChange={(e) => setInviteCode(e.target.value.toUpperCase())}
          placeholder="例: ABC123"
          className="w-full px-3 py-2 border rounded-md"
          required
        />
      </div>

      {error && (
        <p className="text-red-500 text-sm">{error}</p>
      )}

      <button
        type="submit"
        className="w-full bg-green-500 text-white py-2 px-4 rounded-md hover:bg-green-600"
      >
        グループに参加
      </button>
    </form>
  );
}