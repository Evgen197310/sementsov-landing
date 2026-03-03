"use client";

import { useEffect, useState } from "react";
import { Pencil, Trash2, Plus, X } from "lucide-react";

interface Service {
  id: number;
  title: string;
  slug: string;
  description: string;
  content: string;
  order: number;
  categoryId: number;
  category?: { name: string; slug: string };
}

export default function AdminServicesPage() {
  const [items, setItems] = useState<Service[]>([]);
  const [editing, setEditing] = useState<Partial<Service> | null>(null);
  const [loading, setLoading] = useState(true);

  const load = () => {
    setLoading(true);
    fetch("/api/services").then((r) => r.json()).then(setItems).finally(() => setLoading(false));
  };
  useEffect(() => { load(); }, []);

  const save = async () => {
    if (!editing) return;
    const method = editing.id ? "PUT" : "POST";
    const url = editing.id ? `/api/services/${editing.id}` : "/api/services";
    await fetch(url, { method, headers: { "Content-Type": "application/json" }, body: JSON.stringify(editing) });
    setEditing(null);
    load();
  };

  const remove = async (id: number) => {
    if (!confirm("Удалить?")) return;
    await fetch(`/api/services/${id}`, { method: "DELETE" });
    load();
  };

  const indItems = items.filter((s) => s.category?.slug === "individuals");
  const legalItems = items.filter((s) => s.category?.slug === "legal");

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-['Playfair_Display'] font-semibold text-[#f5f3f0]">Услуги</h1>
        <button onClick={() => setEditing({ title: "", slug: "", description: "", content: "", order: 0, categoryId: 1 })} className="flex items-center gap-2 bg-[#c9a962] text-[#0b1c2b] px-4 py-2 rounded-lg text-sm font-medium hover:bg-[#ddc488]">
          <Plus className="w-4 h-4" /> Добавить
        </button>
      </div>

      {loading ? <p className="text-[#8b9caa]">Загрузка...</p> : (
        <>
          <h2 className="text-lg font-semibold text-[#c9a962] mb-3">Физическим лицам</h2>
          <div className="space-y-2 mb-8">
            {indItems.map((s) => (
              <Row key={s.id} item={s} onEdit={() => setEditing(s)} onDelete={() => remove(s.id)} />
            ))}
          </div>
          <h2 className="text-lg font-semibold text-[#c9a962] mb-3">Юридическим лицам</h2>
          <div className="space-y-2">
            {legalItems.map((s) => (
              <Row key={s.id} item={s} onEdit={() => setEditing(s)} onDelete={() => remove(s.id)} />
            ))}
          </div>
        </>
      )}

      {editing && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => setEditing(null)}>
          <div className="bg-[#0b1c2b] border border-[#1e3a51]/50 rounded-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto p-6" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-['Playfair_Display'] font-semibold text-[#f5f3f0]">{editing.id ? "Редактировать" : "Добавить"}</h2>
              <button onClick={() => setEditing(null)} className="text-[#8b9caa] hover:text-[#f5f3f0]"><X className="w-5 h-5" /></button>
            </div>
            <div className="space-y-4">
              <Inp label="Название" value={editing.title || ""} onChange={(v) => setEditing({ ...editing, title: v })} />
              <Inp label="Slug" value={editing.slug || ""} onChange={(v) => setEditing({ ...editing, slug: v })} />
              <div>
                <label className="text-[#8b9caa] text-xs mb-1 block">Категория</label>
                <select value={editing.categoryId || 1} onChange={(e) => setEditing({ ...editing, categoryId: Number(e.target.value) })} className="w-full bg-[#0f2133] border border-[#1e3a51]/50 rounded-lg px-3 py-2.5 text-sm text-[#f5f3f0] focus:border-[#c9a962] focus:outline-none">
                  <option value={1}>Физическим лицам</option>
                  <option value={2}>Юридическим лицам</option>
                </select>
              </div>
              <Inp label="Краткое описание" value={editing.description || ""} onChange={(v) => setEditing({ ...editing, description: v })} />
              <Txt label="Содержимое" value={editing.content || ""} onChange={(v) => setEditing({ ...editing, content: v })} />
              <Inp label="Порядок" value={String(editing.order || 0)} onChange={(v) => setEditing({ ...editing, order: Number(v) })} />
              <button onClick={save} className="w-full bg-[#c9a962] text-[#0b1c2b] py-3 rounded-lg font-medium hover:bg-[#ddc488]">Сохранить</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function Row({ item, onEdit, onDelete }: { item: Service; onEdit: () => void; onDelete: () => void }) {
  return (
    <div className="bg-[#0f2133] border border-[#1e3a51]/30 rounded-lg p-4 flex items-center justify-between gap-4">
      <div className="flex-1 min-w-0">
        <div className="text-[#f5f3f0] font-medium text-sm">{item.title}</div>
        <div className="text-[#5a6f80] text-xs mt-0.5">{item.description?.slice(0, 80)}</div>
      </div>
      <div className="flex gap-2 flex-shrink-0">
        <button onClick={onEdit} className="p-2 text-[#8b9caa] hover:text-[#c9a962]"><Pencil className="w-4 h-4" /></button>
        <button onClick={onDelete} className="p-2 text-[#8b9caa] hover:text-red-400"><Trash2 className="w-4 h-4" /></button>
      </div>
    </div>
  );
}

function Inp({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) {
  return (<div><label className="text-[#8b9caa] text-xs mb-1 block">{label}</label><input value={value} onChange={(e) => onChange(e.target.value)} className="w-full bg-[#0f2133] border border-[#1e3a51]/50 rounded-lg px-3 py-2.5 text-sm text-[#f5f3f0] focus:border-[#c9a962] focus:outline-none" /></div>);
}
function Txt({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) {
  return (<div><label className="text-[#8b9caa] text-xs mb-1 block">{label}</label><textarea value={value} onChange={(e) => onChange(e.target.value)} rows={8} className="w-full bg-[#0f2133] border border-[#1e3a51]/50 rounded-lg px-3 py-2.5 text-sm text-[#f5f3f0] focus:border-[#c9a962] focus:outline-none resize-none" /></div>);
}
