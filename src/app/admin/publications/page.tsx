"use client";

import { useEffect, useState } from "react";
import { BookOpen } from "lucide-react";

interface Pub { id: number; title: string; slug: string; section: string; content: string; }

export default function AdminPublicationsPage() {
  const [items, setItems] = useState<Pub[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/publications").then((r) => r.json()).then(setItems).finally(() => setLoading(false));
  }, []);

  return (
    <div>
      <h1 className="text-2xl font-['Playfair_Display'] font-semibold text-[#f5f3f0] mb-6">Научные труды</h1>
      {loading ? <p className="text-[#8b9caa]">Загрузка...</p> : (
        <div className="space-y-3">
          {items.map((p) => (
            <div key={p.id} className="bg-[#0f2133] border border-[#1e3a51]/30 rounded-xl p-5 flex items-start gap-4">
              <BookOpen className="w-5 h-5 text-[#c9a962] flex-shrink-0 mt-0.5" />
              <div>
                <div className="text-[#f5f3f0] font-medium">{p.title}</div>
                <div className="text-[#5a6f80] text-xs mt-1">/{p.slug} • {p.section === "kuklin" ? "Куклин В.В." : p.section}</div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
