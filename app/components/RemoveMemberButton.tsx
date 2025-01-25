// components/RemoveMemberButton.tsx
"use client";
import { useRouter } from "next/navigation";

export default function RemoveMemberButton({
  groupId,
  memberId,
}: {
  groupId: string;
  memberId: string;
}) {
  const router = useRouter();

  const removeMember = async () => {
    if (!confirm("本当にメンバーを削除しますか？")) return;

    try {
      const res = await fetch(`/api/groups/${groupId}/members/${memberId}`, {
        method: "DELETE",
      });

      if (!res.ok) throw new Error("Failed to remove member");
      router.refresh();
    } catch (error) {
      console.error("Error removing member:", error);
    }
  };

  return (
    <button onClick={removeMember} className="text-red-500 hover:text-red-700">
      削除
    </button>
  );
}
