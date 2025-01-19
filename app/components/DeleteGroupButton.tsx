// app/components/DeleteGroupButton.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

type Props = {
  groupId: string;
};

export default function DeleteGroupButton({ groupId }: Props) {
  const [isConfirming, setIsConfirming] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const handleDelete = async () => {
    try {
      const response = await fetch(`/api/groups/${groupId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "グループの削除に失敗しました");
      }

      router.push("/groups");
      router.refresh();
    } catch (error) {
      console.error("Error deleting group:", error);
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError("グループの削除に失敗しました");
      }
    }
  };

  if (isConfirming) {
    return (
      <div className="space-y-4">
        <p className="text-red-600 font-medium">
          本当にグループを削除しますか？この操作は取り消せません。
        </p>
        <div className="flex gap-4">
          <button
            onClick={handleDelete}
            className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
          >
            削除する
          </button>
          <button
            onClick={() => setIsConfirming(false)}
            className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300"
          >
            キャンセル
          </button>
        </div>
        {error && <p className="text-red-500 text-sm">{error}</p>}
      </div>
    );
  }

  return (
    <button
      onClick={() => setIsConfirming(true)}
      className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
    >
      グループを削除
    </button>
  );
}