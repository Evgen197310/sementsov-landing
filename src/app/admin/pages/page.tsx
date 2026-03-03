"use client";

import { useEffect, useState } from "react";
import { Pencil, X } from "lucide-react";

interface PageItem {
  id: number;
  slug: string;
  title: string;
  content: string;
}

export default function AdminPagesPage() {
  const [pages, setPages] = useState<PageItem[]>([]);
  const [editing, setEditing] = useState<PageItem | null>(null);
  const [loading, setLoading] = useState(true);

  const load = () => {
    setLoading(true);
    fetch("/api/pages").then((r) => r.json()).then(setPages).finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  const save = async () => {
    if (!editing) return;
    await fetch(`/api/pages/${editing.slug}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title: editing.title, content: editing.content }),
    });
    setEditing(null);
    load();
  };

  return (
    <div>
      <h1 className="text-2xl font-['Playfair_Display'] font-semibold text-[#f5f3f0] mb-6">Статические страницы</h1>
      {loading ? (
        <p className="text-[#8b9caa]">Загрузка...</p>
      ) : (
        <div className="space-y-3">
          {pages.map((p) => (
            <div key={p.id} className="bg-[#0f2133] border border-[#1e3a51]/30 rounded-xl p-4 flex items-center justify-between gap-4">
              <div>
                <div className="text-[#f5f3f0] font-medium">{p.title}</div>
                <div className="text-[#5a6f80] text-xs">/{p.slug}</div>
              </div>
              <button onClick={() => setEditing(p)} className="p-2 text-[#8b9caa] hover:text-[#c9a962] transition-colors">
                <Pencil className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      )}

      {editing && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => setEditing(null)}>
          <div className="bg-[#0b1c2b] border border-[#1e3a51]/50 rounded-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto p-6" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-['Playfair_Display'] font-semibold text-[#f5f3f0]">
                Редактировать: {editing.title}
              </h2>
              <button onClick={() => setEditing(null)} className="text-[#8b9caa] hover:text-[#f5f3f0]">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="text-[#8b9caa] text-xs mb-1 block">Заголовок</label>
                <input value={editing.title} onChange={(e) => setEditing({ ...editing, title: e.target.value })} className="w-full bg-[#0f2133] border border-[#1e3a51]/50 rounded-lg px-3 py-2.5 text-sm text-[#f5f3f0] focus:border-[#c9a962] focus:outline-none" />
              </div>
              <div>
                <label className="text-[#8b9caa] text-xs mb-1 block">Содержимое</label>
                <textarea value={editing.content} onChange={(e) => setEditing({ ...editing, content: e.target.value })} rows={12} className="w-full bg-[#0f2133] border border-[#1e3a51]/50 rounded-lg px-3 py-2.5 text-sm text-[#f5f3f0] focus:border-[#c9a962] focus:outline-none resize-none" />
              </div>
              <button onClick={save} className="w-full bg-[#c9a962] text-[#0b1c2b] py-3 rounded-lg font-medium hover:bg-[#ddc488] transition-colors">
                Сохранить
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
