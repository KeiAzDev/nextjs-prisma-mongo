// app/components/DateSelectionForm.tsx
"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

type Props = {
  initialDates: Date[];
  userEmail: string;
};

export default function DateSelectionForm({ initialDates, userEmail }: Props) {
  const [dates, setDates] = useState<string[]>(
    initialDates.map(d => new Date(d).toISOString().split('T')[0])
  );
  const router = useRouter();

  const addDate = (newDate: string) => {
    if (!dates.includes(newDate)) {
      setDates([...dates, newDate].sort());
    }
  };

  const removeDate = (dateToRemove: string) => {
    setDates(dates.filter(date => date !== dateToRemove));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const response = await fetch("/api/dates", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ dates, email: userEmail }),
      });

      if (!response.ok) throw new Error("Failed to save dates");
      
      router.refresh();
    } catch (error) {
      console.error("Error saving dates:", error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label htmlFor="date" className="block mb-2">
          日付を追加
        </label>
        <input
          type="date"
          id="date"
          onChange={(e) => addDate(e.target.value)}
          className="px-4 py-2 border rounded"
        />
      </div>

      <div className="space-y-2">
        <h3 className="font-medium">選択中の日付:</h3>
        {dates.length > 0 ? (
          dates.map((date) => (
            <div key={date} className="flex items-center justify-between p-2 bg-gray-50 rounded">
              <span>{new Date(date).toLocaleDateString("ja-JP")}</span>
              <button
                type="button"
                onClick={() => removeDate(date)}
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