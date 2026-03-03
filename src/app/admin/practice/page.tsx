"use client";

import { useEffect, useState } from "react";

interface PracticeCategory {
  id: number;
  name: string;
  slug: string;
  description: string;
  cases: { id: number; title: string; slug: string; tags: string }[];
}

export default function AdminPracticePage() {
  const [data, setData] = useState<{ categories: PracticeCategory[]; uncategorized: { id: number; title: string; tags: string }[] }>({ categories: [], uncategorized: [] });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/practice").then((r) => r.json()).then(setData).finally(() => setLoading(false));
  }, []);

  return (
    <div>
      <h1 className="text-2xl font-['Playfair_Display'] font-semibold text-[#f5f3f0] mb-6">Практика</h1>
      {loading ? <p className="text-[#8b9caa]">Загрузка...</p> : (
        <>
          <div className="space-y-4 mb-8">
            {data.categories.map((cat) => (
              <div key={cat.id} className="bg-[#0f2133] border border-[#1e3a51]/30 rounded-xl p-5">
                <h3 className="text-[#f5f3f0] font-semibold">{cat.name}</h3>
                <p className="text-[#5a6f80] text-xs mb-3">/{cat.slug} • {cat.cases.length} дел</p>
                {cat.cases.map((c) => (
                  <div key={c.id} className="py-2 border-t border-[#1e3a51]/20 first:border-0">
                    <div className="text-[#c5cdd5] text-sm">{c.title}</div>
                    {c.tags && (
                      <div className="flex flex-wrap gap-1 mt-1">
                        {c.tags.split(",").map((t) => (
                          <span key={t} className="text-[10px] bg-[#1e3a51]/50 text-[#8b9caa] px-1.5 py-0.5 rounded">{t.trim()}</span>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ))}
          </div>
          {data.uncategorized.length > 0 && (
            <>
              <h2 className="text-lg font-semibold text-[#c9a962] mb-3">Без категории</h2>
              <div className="space-y-2">
                {data.uncategorized.map((c) => (
                  <div key={c.id} className="bg-[#0f2133] border border-[#1e3a51]/30 rounded-lg p-4">
                    <div className="text-[#f5f3f0] text-sm">{c.title}</div>
                  </div>
                ))}
              </div>
            </>
          )}
        </>
      )}
    </div>
  );
}
