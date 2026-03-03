"use client";

import { useEffect, useState } from "react";
import { FileText } from "lucide-react";

interface Doc { id: number; title: string; slug: string; content: string; }

export default function AdminDocumentsPage() {
  const [items, setItems] = useState<Doc[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/documents").then((r) => r.json()).then(setItems).finally(() => setLoading(false));
  }, []);

  return (
    <div>
      <h1 className="text-2xl font-['Playfair_Display'] font-semibold text-[#f5f3f0] mb-6">Документы</h1>
      {loading ? <p className="text-[#8b9caa]">Загрузка...</p> : (
        <div className="space-y-3">
          {items.map((d) => (
            <div key={d.id} className="bg-[#0f2133] border border-[#1e3a51]/30 rounded-xl p-5 flex items-start gap-4">
              <FileText className="w-5 h-5 text-[#c9a962] flex-shrink-0 mt-0.5" />
              <div>
                <div className="text-[#f5f3f0] font-medium">{d.title}</div>
                <div className="text-[#5a6f80] text-xs mt-1">/{d.slug}</div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
