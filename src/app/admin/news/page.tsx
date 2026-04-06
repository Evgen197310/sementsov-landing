"use client";

import { useEffect, useState } from "react";
import { Plus, Pencil, Trash2, X } from "lucide-react";
import { FileAttachments } from "@/components/admin/FileAttachments";

interface Article {
  id: number;
  title: string;
  slug: string;
  content: string;
  excerpt: string;
  section: string;
  attachments: string;
}

export default function AdminNewsPage() {
  const [items, setItems] = useState<Article[]>([]);
  const [editing, setEditing] = useState<Partial<Article> | null>(null);
  const [loading, setLoading] = useState(true);

  const load = () => {
    setLoading(true);
    fetch("/api/news").then((r) => r.json()).then(setItems).finally(() => setLoading(false));
  };
  useEffect(() => { load(); }, []);

  const save = async () => {
    if (!editing) return;
    const method = editing.id ? "PUT" : "POST";
    const url = editing.id ? `/api/news/${editing.id}` : "/api/news";
    await fetch(url, { method, headers: { "Content-Type": "application/json" }, body: JSON.stringify(editing) });
    setEditing(null);
    load();
  };

  const remove = async (id: number) => {
    if (!confirm("Удалить?")) return;
    await fetch(`/api/news/${id}`, { method: "DELETE" });
    load();
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-['Playfair_Display'] font-semibold text-[#f5f3f0]">Новости и законодательство</h1>
        <button onClick={() => setEditing({ title: "", slug: "", content: "", excerpt: "", section: "news", attachments: "" })} className="flex items-center gap-2 bg-[#c9a962] text-[#0b1c2b] px-4 py-2 rounded-lg text-sm font-medium hover:bg-[#ddc488] transition-colors">
          <Plus className="w-4 h-4" /> Добавить
        </button>
      </div>
      {loading ? <p className="text-[#8b9caa]">Загрузка...</p> : (
        <div className="space-y-3">
          {items.map((a) => (
            <div key={a.id} className="bg-[#0f2133] border border-[#1e3a51]/30 rounded-xl p-4 flex items-center justify-between gap-4">
              <div className="flex-1 min-w-0">
                <div className="text-[#f5f3f0] font-medium truncate">{a.title}</div>
                <div className="text-[#5a6f80] text-xs mt-1">
                  {a.section === "news" ? "Новости" : "Законодательство"} • /{a.slug}
                </div>
              </div>
              <div className="flex gap-2 flex-shrink-0">
                <button onClick={() => setEditing(a)} className="p-2 text-[#8b9caa] hover:text-[#c9a962]"><Pencil className="w-4 h-4" /></button>
                <button onClick={() => remove(a.id)} className="p-2 text-[#8b9caa] hover:text-red-400"><Trash2 className="w-4 h-4" /></button>
              </div>
            </div>
          ))}
        </div>
      )}
      {editing && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => setEditing(null)}>
          <div className="bg-[#0b1c2b] border border-[#1e3a51]/50 rounded-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto p-6" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-['Playfair_Display'] font-semibold text-[#f5f3f0]">{editing.id ? "Редактировать" : "Добавить"}</h2>
              <button onClick={() => setEditing(null)} className="text-[#8b9caa] hover:text-[#f5f3f0]"><X className="w-5 h-5" /></button>
            </div>
            <div className="space-y-4">
              <Inp label="Заголовок" value={editing.title || ""} onChange={(v) => setEditing({ ...editing, title: v, slug: editing.slug || v.toLowerCase().replace(/[\s]+/g, "-").replace(/[^a-z0-9а-яё-]/gi, "") })} />
              <Inp label="Slug" value={editing.slug || ""} onChange={(v) => setEditing({ ...editing, slug: v })} />
              <div>
                <label className="text-[#8b9caa] text-xs mb-1 block">Раздел</label>
                <select value={editing.section || "news"} onChange={(e) => setEditing({ ...editing, section: e.target.value })} className="w-full bg-[#0f2133] border border-[#1e3a51]/50 rounded-lg px-3 py-2.5 text-sm text-[#f5f3f0] focus:border-[#c9a962] focus:outline-none">
                  <option value="news">Новости</option>
                  <option value="legislation">Законодательство</option>
                </select>
              </div>
              <Inp label="Превью" value={editing.excerpt || ""} onChange={(v) => setEditing({ ...editing, excerpt: v })} />
              <Txt label="Содержимое" value={editing.content || ""} onChange={(v) => setEditing({ ...editing, content: v })} />
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
  return (<div><label className="text-[#8b9caa] text-xs mb-1 block">{label}</label><input value={value} onChange={(e) => onChange(e.target.value)} className="w-full bg-[#0f2133] border border-[#1e3a51]/50 rounded-lg px-3 py-2.5 text-sm text-[#f5f3f0] focus:border-[#c9a962] focus:outline-none" /></div>);
}
function Txt({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) {
  return (<div><label className="text-[#8b9caa] text-xs mb-1 block">{label}</label><textarea value={value} onChange={(e) => onChange(e.target.value)} rows={8} className="w-full bg-[#0f2133] border border-[#1e3a51]/50 rounded-lg px-3 py-2.5 text-sm text-[#f5f3f0] focus:border-[#c9a962] focus:outline-none resize-none" /></div>);
}
