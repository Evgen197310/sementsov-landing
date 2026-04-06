"use client";

import { useEffect, useState } from "react";
import { BookOpen, Plus, Pencil, Trash2, X } from "lucide-react";
import { FileAttachments } from "@/components/admin/FileAttachments";

interface Pub { id: number; title: string; slug: string; section: string; content: string; attachments: string; }

export default function AdminPublicationsPage() {
  const [items, setItems] = useState<Pub[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<Partial<Pub> | null>(null);

  const load = () => {
    setLoading(true);
    fetch("/api/publications").then((r) => r.json()).then(setItems).finally(() => setLoading(false));
  };
  useEffect(() => { load(); }, []);

  const save = async () => {
    if (!editing) return;
    const method = editing.id ? "PUT" : "POST";
    const url = editing.id ? `/api/publications/${editing.id}` : "/api/publications";
    await fetch(url, { method, headers: { "Content-Type": "application/json" }, body: JSON.stringify(editing) });
    setEditing(null);
    load();
  };

  const remove = async (id: number) => {
    if (!confirm("Удалить публикацию?")) return;
    await fetch(`/api/publications/${id}`, { method: "DELETE" });
    load();
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-['Playfair_Display'] font-semibold text-[#f5f3f0]">Научные труды</h1>
        <button onClick={() => setEditing({ title: "", slug: "", section: "", content: "", attachments: "" })} className="flex items-center gap-2 bg-[#c9a962] text-[#0b1c2b] px-4 py-2 rounded-lg text-sm font-medium hover:bg-[#ddc488] transition-colors">
          <Plus className="w-4 h-4" /> Добавить
        </button>
      </div>
      {loading ? <p className="text-[#8b9caa]">Загрузка...</p> : (
        <div className="space-y-3">
          {items.map((p) => (
            <div key={p.id} className="bg-[#0f2133] border border-[#1e3a51]/30 rounded-xl p-5 flex items-center gap-4">
              <BookOpen className="w-5 h-5 text-[#c9a962] flex-shrink-0" />
              <div className="flex-1 min-w-0">
                <div className="text-[#f5f3f0] font-medium truncate">{p.title}</div>
                <div className="text-[#5a6f80] text-xs mt-1">/{p.slug}{p.section && ` • ${p.section}`}</div>
              </div>
              <div className="flex gap-1 flex-shrink-0">
                <button onClick={() => setEditing(p)} className="p-2 text-[#8b9caa] hover:text-[#c9a962]"><Pencil className="w-4 h-4" /></button>
                <button onClick={() => remove(p.id)} className="p-2 text-[#8b9caa] hover:text-red-400"><Trash2 className="w-4 h-4" /></button>
              </div>
            </div>
          ))}
          {items.length === 0 && <p className="text-[#5a6f80] text-sm">Нет публикаций</p>}
        </div>
      )}

      {editing && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => setEditing(null)}>
          <div className="bg-[#0b1c2b] border border-[#1e3a51]/50 rounded-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto p-6" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-['Playfair_Display'] font-semibold text-[#f5f3f0]">{editing.id ? "Редактировать публикацию" : "Новая публикация"}</h2>
              <button onClick={() => setEditing(null)} className="text-[#8b9caa] hover:text-[#f5f3f0]"><X className="w-5 h-5" /></button>
            </div>
            <div className="space-y-4">
              <Inp label="Название" value={editing.title || ""} onChange={(v) => setEditing({ ...editing, title: v, slug: editing.slug || toSlug(v) })} />
              <Inp label="Slug" value={editing.slug || ""} onChange={(v) => setEditing({ ...editing, slug: v })} />
              <Inp label="Раздел / Автор" value={editing.section || ""} onChange={(v) => setEditing({ ...editing, section: v })} />
              <div>
                <label className="text-[#8b9caa] text-xs mb-1 block">Содержимое</label>
                <textarea value={editing.content || ""} onChange={(e) => setEditing({ ...editing, content: e.target.value })} rows={8} className="w-full bg-[#0f2133] border border-[#1e3a51]/50 rounded-lg px-3 py-2.5 text-sm text-[#f5f3f0] focus:border-[#c9a962] focus:outline-none resize-none" />
              </div>
              <FileAttachments value={editing.attachments || ""} onChange={(v) => setEditing({ ...editing, attachments: v })} />
              <button onClick={save} className="w-full bg-[#c9a962] text-[#0b1c2b] py-3 rounded-lg font-medium hover:bg-[#ddc488] transition-colors">Сохранить</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function Inp({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) {
  return (
    <div>
      <label className="text-[#8b9caa] text-xs mb-1 block">{label}</label>
      <input value={value} onChange={(e) => onChange(e.target.value)} className="w-full bg-[#0f2133] border border-[#1e3a51]/50 rounded-lg px-3 py-2.5 text-sm text-[#f5f3f0] focus:border-[#c9a962] focus:outline-none" />
    </div>
  );
}

function toSlug(s: string) {
  return s.toLowerCase().replace(/[\s]+/g, "-").replace(/[^a-z0-9а-яё-]/gi, "").slice(0, 80);
}
