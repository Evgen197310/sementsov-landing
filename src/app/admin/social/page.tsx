"use client";

import { useEffect, useState } from "react";
import { Plus, Pencil, Trash2, X, Share2 } from "lucide-react";

interface SocialLink {
  id: number;
  platform: string;
  url: string;
  icon: string;
  order: number;
}

const ICON_OPTIONS = [
  { value: "telegram", label: "Telegram" },
  { value: "vk", label: "ВКонтакте" },
  { value: "youtube", label: "YouTube" },
  { value: "rutube", label: "RuTube" },
  { value: "dzen", label: "Дзен" },
  { value: "ok", label: "Одноклассники" },
  { value: "instagram", label: "Instagram" },
  { value: "facebook", label: "Facebook" },
  { value: "twitter", label: "X / Twitter" },
  { value: "linkedin", label: "LinkedIn" },
  { value: "whatsapp", label: "WhatsApp" },
  { value: "other", label: "Другое" },
];

export default function AdminSocialPage() {
  const [items, setItems] = useState<SocialLink[]>([]);
  const [editing, setEditing] = useState<Partial<SocialLink> | null>(null);
  const [loading, setLoading] = useState(true);

  const load = () => {
    setLoading(true);
    fetch("/api/social").then((r) => r.json()).then(setItems).finally(() => setLoading(false));
  };
  useEffect(() => { load(); }, []);

  const save = async () => {
    if (!editing) return;
    const method = editing.id ? "PUT" : "POST";
    const url = editing.id ? `/api/social/${editing.id}` : "/api/social";
    await fetch(url, { method, headers: { "Content-Type": "application/json" }, body: JSON.stringify(editing) });
    setEditing(null);
    load();
  };

  const remove = async (id: number) => {
    if (!confirm("Удалить?")) return;
    await fetch(`/api/social/${id}`, { method: "DELETE" });
    load();
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-['Playfair_Display'] font-semibold text-[#f5f3f0]">Мы в соцсетях</h1>
        <button onClick={() => setEditing({ platform: "", url: "", icon: "telegram", order: 0 })} className="flex items-center gap-2 bg-[#c9a962] text-[#0b1c2b] px-4 py-2 rounded-lg text-sm font-medium hover:bg-[#ddc488] transition-colors">
          <Plus className="w-4 h-4" /> Добавить
        </button>
      </div>
      {loading ? <p className="text-[#8b9caa]">Загрузка...</p> : (
        <div className="space-y-3">
          {items.map((s) => (
            <div key={s.id} className="bg-[#0f2133] border border-[#1e3a51]/30 rounded-xl p-4 flex items-center justify-between gap-4">
              <div className="flex items-center gap-3 flex-1 min-w-0">
                <Share2 className="w-5 h-5 text-[#c9a962] flex-shrink-0" />
                <div>
                  <div className="text-[#f5f3f0] font-medium">{s.platform}</div>
                  <div className="text-[#5a6f80] text-xs truncate">{s.url}</div>
                </div>
              </div>
              <div className="flex gap-2 flex-shrink-0">
                <button onClick={() => setEditing(s)} className="p-2 text-[#8b9caa] hover:text-[#c9a962]"><Pencil className="w-4 h-4" /></button>
                <button onClick={() => remove(s.id)} className="p-2 text-[#8b9caa] hover:text-red-400"><Trash2 className="w-4 h-4" /></button>
              </div>
            </div>
          ))}
          {items.length === 0 && <p className="text-[#5a6f80] text-sm">Нет ссылок на соцсети</p>}
        </div>
      )}
      {editing && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => setEditing(null)}>
          <div className="bg-[#0b1c2b] border border-[#1e3a51]/50 rounded-xl w-full max-w-lg max-h-[90vh] overflow-y-auto p-6" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-['Playfair_Display'] font-semibold text-[#f5f3f0]">{editing.id ? "Редактировать" : "Добавить"}</h2>
              <button onClick={() => setEditing(null)} className="text-[#8b9caa] hover:text-[#f5f3f0]"><X className="w-5 h-5" /></button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="text-[#8b9caa] text-xs mb-1 block">Название платформы</label>
                <input value={editing.platform || ""} onChange={(e) => setEditing({ ...editing, platform: e.target.value })} className="w-full bg-[#0f2133] border border-[#1e3a51]/50 rounded-lg px-3 py-2.5 text-sm text-[#f5f3f0] focus:border-[#c9a962] focus:outline-none" placeholder="Telegram" />
              </div>
              <div>
                <label className="text-[#8b9caa] text-xs mb-1 block">URL</label>
                <input value={editing.url || ""} onChange={(e) => setEditing({ ...editing, url: e.target.value })} className="w-full bg-[#0f2133] border border-[#1e3a51]/50 rounded-lg px-3 py-2.5 text-sm text-[#f5f3f0] focus:border-[#c9a962] focus:outline-none" placeholder="https://t.me/..." />
              </div>
              <div>
                <label className="text-[#8b9caa] text-xs mb-1 block">Иконка</label>
                <select value={editing.icon || "other"} onChange={(e) => setEditing({ ...editing, icon: e.target.value })} className="w-full bg-[#0f2133] border border-[#1e3a51]/50 rounded-lg px-3 py-2.5 text-sm text-[#f5f3f0] focus:border-[#c9a962] focus:outline-none">
                  {ICON_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
                </select>
              </div>
              <div>
                <label className="text-[#8b9caa] text-xs mb-1 block">Порядок</label>
                <input type="number" value={editing.order ?? 0} onChange={(e) => setEditing({ ...editing, order: Number(e.target.value) })} className="w-full bg-[#0f2133] border border-[#1e3a51]/50 rounded-lg px-3 py-2.5 text-sm text-[#f5f3f0] focus:border-[#c9a962] focus:outline-none" />
              </div>
              <button onClick={save} className="w-full bg-[#c9a962] text-[#0b1c2b] py-3 rounded-lg font-medium hover:bg-[#ddc488] transition-colors">Сохранить</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
