"use client";

import { useEffect, useState } from "react";

interface MediaCategory {
  id: number;
  name: string;
  slug: string;
  description: string;
  articles: { id: number; title: string; slug: string }[];
}

export default function AdminMediaPage() {
  const [data, setData] = useState<{ categories: MediaCategory[]; uncategorized: { id: number; title: string; slug: string }[] }>({ categories: [], uncategorized: [] });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/media").then((r) => r.json()).then(setData).finally(() => setLoading(false));
  }, []);

  return (
    <div>
      <h1 className="text-2xl font-['Playfair_Display'] font-semibold text-[#f5f3f0] mb-6">Коллегия в СМИ</h1>
      {loading ? <p className="text-[#8b9caa]">Загрузка...</p> : (
        <>
          <h2 className="text-lg font-semibold text-[#c9a962] mb-4">Категории дел</h2>
          <div className="space-y-4 mb-8">
            {data.categories.map((cat) => (
              <div key={cat.id} className="bg-[#0f2133] border border-[#1e3a51]/30 rounded-xl p-5">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <h3 className="text-[#f5f3f0] font-semibold">{cat.name}</h3>
                    <p className="text-[#5a6f80] text-xs">/{cat.slug} • {cat.articles.length} статей</p>
                  </div>
                </div>
                {cat.description && <p className="text-[#8b9caa] text-sm mb-3">{cat.description}</p>}
                {cat.articles.length > 0 && (
                  <div className="space-y-1 mt-3 pt-3 border-t border-[#1e3a51]/20">
                    {cat.articles.slice(0, 5).map((a) => (
                      <div key={a.id} className="text-[#8b9caa] text-sm">• {a.title}</div>
                    ))}
                    {cat.articles.length > 5 && (
                      <div className="text-[#5a6f80] text-xs mt-1">...и ещё {cat.articles.length - 5} статей</div>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>

          {data.uncategorized.length > 0 && (
            <>
              <h2 className="text-lg font-semibold text-[#c9a962] mb-4">Статьи без категории</h2>
              <div className="space-y-2">
                {data.uncategorized.map((a) => (
                  <div key={a.id} className="bg-[#0f2133] border border-[#1e3a51]/30 rounded-lg p-4">
                    <div className="text-[#f5f3f0] text-sm font-medium">{a.title}</div>
                    <div className="text-[#5a6f80] text-xs mt-1">/{a.slug}</div>
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
