// app/components/DateSelectionForm.tsx
"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

interface UserDate {
  id: string;
  date: Date;
  memo: string;
  userId: string;
}

interface Selection {
  date: string;
  memo: string;
}

type Props = {
  userEmail: string;
  savedDates: UserDate[];
};

const formatJapanDate = (date: string | Date) => {
  return new Date(date).toLocaleString("ja-JP", {
    timeZone: "Asia/Tokyo",
    year: "numeric",
    month: "long",
    day: "numeric",
    weekday: "long",
  });
};

export default function DateSelectionForm({
  userEmail,
  savedDates: initialSavedDates,
}: Props) {
  const [selections, setSelections] = useState<Selection[]>([]);
  const [savedDates, setSavedDates] = useState<UserDate[]>(initialSavedDates);
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

  const removeSavedDate = async (dateId: string) => {
    try {
      const response = await fetch(`/api/dates/${dateId}`, {
        method: "DELETE",
      });

      if (!response.ok) throw new Error("Failed to delete date");

      setSavedDates(savedDates.filter((d) => d.id !== dateId));
      router.refresh();
    } catch (error) {
      console.error("Error deleting date:", error);
    }
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

      const data = await response.json();
      setSavedDates(data.dates);
      setSelections([]);
      router.refresh();
    } catch (error) {
      console.error("Error saving dates:", error);
    }
  };

  return (
    <div className="space-y-8">
      {savedDates?.length > 0 && (
        <div className="space-y-2">
          <h3 className="font-medium">保存済みの日付:</h3>
          <div className="grid gap-2">
            {savedDates.map((date) => (
              <div
                key={date.id}
                className="flex items-center justify-between p-2 bg-gray-50 rounded"
              >
                <span>
                  {formatJapanDate(date.date)} - {date.memo}
                </span>
                <button onClick={() => removeSavedDate(date.id)} className="text-red-500 hover:text-red-700">削除</button>
              </div>
            ))}
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-2">
          <label htmlFor="date" className="block mb-2">
            新しい日付を追加
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

        {selections.length > 0 && (
          <>
            <div className="space-y-2">
              <h3 className="font-medium">追加予定の日付:</h3>
              <div className="grid gap-2">
                {selections.map(({ date, memo }) => (
                  <div key={date} className="p-2 bg-blue-50 rounded">
                    <span>
                      {formatJapanDate(date)} - {memo}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <button
              type="submit"
              className="w-full px-6 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
            >
              保存
            </button>
          </>
        )}
      </form>
    </div>
  );
}
