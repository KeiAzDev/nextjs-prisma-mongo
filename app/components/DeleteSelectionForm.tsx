// app/components/DateSelectionForm.tsx
"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

interface Selection {
  date: string;
  memo: string;
}

type Props = {
  initialDates: Date[];
  userEmail: string;
};

export default function DateSelectionForm({ initialDates, userEmail }: Props) {
  const [selections, setSelections] = useState<Selection[]>([]);
  const router = useRouter();

  const addSelection = (date: string, memo: string) => {
    const existingIndex = selections.findIndex((s) => s.date === date);
    if (existingIndex >= 0) {
      const newSelections = [...selections];
      newSelections[existingIndex] = { date, memo };
      setSelections(newSelections);
    } else {
      setSelections(
        [...selections, { date, memo }].sort((a, b) =>
          a.date.localeCompare(b.date)
        )
      );
    }
  };

  // Rest of the component remains the same

  const removeSelection = (dateToRemove: string) => {
    setSelections(selections.filter((s) => s.date !== dateToRemove));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await fetch("/api/dates", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ selections, email: userEmail }),
      });

      if (!response.ok) throw new Error("Failed to save dates");

      router.refresh();
    } catch (error) {
      console.error("Error saving dates:", error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-2">
        <label htmlFor="date" className="block mb-2">
          日付を追加
        </label>
        <div className="flex gap-2">
          <input type="date" id="date" className="px-4 py-2 border rounded" />
          <select
            id="memo"
            className="px-4 py-2 border rounded"
            defaultValue=""
          >
            <option value="" disabled>
              選択してください
            </option>
            <option value="日勤">日勤</option>
            <option value="中番">中番</option>
            <option value="遅番">遅番</option>
            <option value="休日">休日</option>
            <option value="有給">有給</option>
          </select>
          <button
            type="button"
            onClick={() => {
              const dateInput = document.getElementById(
                "date"
              ) as HTMLInputElement;
              const memoInput = document.getElementById(
                "memo"
              ) as HTMLSelectElement;
              if (dateInput.value && memoInput.value) {
                addSelection(dateInput.value, memoInput.value);
                dateInput.value = "";
                memoInput.value = "";
              }
            }}
            className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
          >
            追加
          </button>
        </div>
      </div>

      <div className="space-y-2">
        <h3 className="font-medium">選択中の日付:</h3>
        {selections.length > 0 ? (
          selections.map(({ date, memo }) => (
            <div
              key={date}
              className="flex items-center justify-between p-2 bg-gray-50 rounded"
            >
              <span>
                {new Date(date).toLocaleDateString("ja-JP")} - {memo}
              </span>
              <button
                type="button"
                onClick={() => removeSelection(date)}
                className="text-red-500 hover:text-red-700"
              >
                削除
              </button>
            </div>
          ))
        ) : (
          <p className="text-gray-500">日付を選択してください</p>
        )}
      </div>

      <button
        type="submit"
        className="w-full px-6 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
      >
        保存
      </button>
    </form>
  );
}
