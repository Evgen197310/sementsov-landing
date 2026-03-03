"use client";

import { useEffect, useState } from "react";
import { Pencil, Trash2, Plus, X, PlusCircle, MinusCircle } from "lucide-react";
import IconPicker from "@/components/admin/IconPicker";
import { getIcon } from "@/lib/icons";

interface Faq { id?: number; question: string; answer: string; order: number; }

interface Service {
  id: number;
  title: string;
  slug: string;
  description: string;
  content: string;
  icon: string;
  order: number;
  categoryId: number;
  category?: { id: number; name: string; slug: string };
  faqs: Faq[];
}

interface Category { id: number; name: string; slug: string; }

export default function AdminServicesPage() {
  const [items, setItems] = useState<Service[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [editing, setEditing] = useState<Partial<Service> & { faqs: Faq[] } | null>(null);
  const [loading, setLoading] = useState(true);

  const load = () => {
    setLoading(true);
    fetch("/api/services").then((r) => r.json()).then((d) => { setItems(d.services); setCategories(d.categories); }).finally(() => setLoading(false));
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

  const startEdit = (s?: Service) => {
    if (s) {
      setEditing({ ...s, faqs: s.faqs || [] });
    } else {
      setEditing({ title: "", slug: "", description: "", content: "", icon: "", order: 0, categoryId: categories[0]?.id || 1, faqs: [] });
    }
  };

  const addFaq = () => {
    if (!editing) return;
    setEditing({ ...editing, faqs: [...editing.faqs, { question: "", answer: "", order: editing.faqs.length }] });
  };

  const removeFaq = (idx: number) => {
    if (!editing) return;
    setEditing({ ...editing, faqs: editing.faqs.filter((_, i) => i !== idx) });
  };

  const updateFaq = (idx: number, field: keyof Faq, value: string) => {
    if (!editing) return;
    const faqs = [...editing.faqs];
    faqs[idx] = { ...faqs[idx], [field]: value };
    setEditing({ ...editing, faqs });
  };

  const grouped = categories.map((cat) => ({
    ...cat,
    services: items.filter((s) => s.categoryId === cat.id),
  }));

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-['Playfair_Display'] font-semibold text-[#f5f3f0]">Услуги</h1>
        <button onClick={() => startEdit()} className="flex items-center gap-2 bg-[#c9a962] text-[#0b1c2b] px-4 py-2 rounded-lg text-sm font-medium hover:bg-[#ddc488]">
          <Plus className="w-4 h-4" /> Добавить
        </button>
      </div>

      {loading ? <p className="text-[#8b9caa]">Загрузка...</p> : (
        <>
          {grouped.map((g) => (
            <div key={g.id} className="mb-8">
              <h2 className="text-lg font-semibold text-[#c9a962] mb-3">{g.name}</h2>
              <div className="space-y-2">
                {g.services.map((s) => {
                  const Icon = getIcon(s.icon);
                  return (
                    <div key={s.id} className="bg-[#0f2133] border border-[#1e3a51]/30 rounded-lg p-4 flex items-center justify-between gap-4">
                      <div className="flex items-center gap-3 flex-1 min-w-0">
                        {Icon && <Icon className="w-5 h-5 text-[#c9a962] flex-shrink-0" />}
                        <div className="flex-1 min-w-0">
                          <div className="text-[#f5f3f0] font-medium text-sm">{s.title}</div>
                          <div className="text-[#5a6f80] text-xs mt-0.5">{s.description?.slice(0, 80)}{s.faqs?.length ? ` • ${s.faqs.length} FAQ` : ""}</div>
                        </div>
                      </div>
                      <div className="flex gap-2 flex-shrink-0">
                        <button onClick={() => startEdit(s)} className="p-2 text-[#8b9caa] hover:text-[#c9a962]"><Pencil className="w-4 h-4" /></button>
                        <button onClick={() => remove(s.id)} className="p-2 text-[#8b9caa] hover:text-red-400"><Trash2 className="w-4 h-4" /></button>
                      </div>
                    </div>
                  );
                })}
                {g.services.length === 0 && <p className="text-[#5a6f80] text-sm">Нет услуг</p>}
              </div>
            </div>
          ))}
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
              <Inp label="Название" value={editing.title || ""} onChange={(v) => setEditing({ ...editing, title: v, slug: editing.slug || toSlug(v) })} />
              <Inp label="Slug" value={editing.slug || ""} onChange={(v) => setEditing({ ...editing, slug: v })} />
              <div>
                <label className="text-[#8b9caa] text-xs mb-1 block">Иконка</label>
                <IconPicker value={editing.icon || ""} onChange={(v) => setEditing({ ...editing, icon: v })} />
              </div>
              <div>
                <label className="text-[#8b9caa] text-xs mb-1 block">Категория</label>
                <select value={editing.categoryId || categories[0]?.id} onChange={(e) => setEditing({ ...editing, categoryId: Number(e.target.value) })} className="w-full bg-[#0f2133] border border-[#1e3a51]/50 rounded-lg px-3 py-2.5 text-sm text-[#f5f3f0] focus:border-[#c9a962] focus:outline-none">
                  {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
              </div>
              <Inp label="Краткое описание" value={editing.description || ""} onChange={(v) => setEditing({ ...editing, description: v })} />
              <Txt label="Содержимое" value={editing.content || ""} onChange={(v) => setEditing({ ...editing, content: v })} />
              <Inp label="Порядок" value={String(editing.order || 0)} onChange={(v) => setEditing({ ...editing, order: Number(v) })} />

              {/* FAQ section */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-[#8b9caa] text-xs">FAQ ({editing.faqs.length})</label>
                  <button type="button" onClick={addFaq} className="text-xs text-[#c9a962] hover:text-[#ddc488] flex items-center gap-1">
                    <PlusCircle className="w-3.5 h-3.5" /> Добавить вопрос
                  </button>
                </div>
                <div className="space-y-3">
                  {editing.faqs.map((faq, idx) => (
                    <div key={idx} className="bg-[#0f2133]/50 border border-[#1e3a51]/20 rounded-lg p-3 space-y-2">
                      <div className="flex items-start justify-between gap-2">
                        <input value={faq.question} onChange={(e) => updateFaq(idx, "question", e.target.value)} placeholder="Вопрос" className="flex-1 bg-[#0f2133] border border-[#1e3a51]/50 rounded-lg px-3 py-2 text-sm text-[#f5f3f0] focus:border-[#c9a962] focus:outline-none" />
                        <button type="button" onClick={() => removeFaq(idx)} className="p-1.5 text-[#8b9caa] hover:text-red-400 flex-shrink-0">
                          <MinusCircle className="w-4 h-4" />
                        </button>
                      </div>
                      <textarea value={faq.answer} onChange={(e) => updateFaq(idx, "answer", e.target.value)} placeholder="Ответ" rows={2} className="w-full bg-[#0f2133] border border-[#1e3a51]/50 rounded-lg px-3 py-2 text-sm text-[#f5f3f0] focus:border-[#c9a962] focus:outline-none resize-none" />
                    </div>
                  ))}
                </div>
              </div>

              <button onClick={save} className="w-full bg-[#c9a962] text-[#0b1c2b] py-3 rounded-lg font-medium hover:bg-[#ddc488]">Сохранить</button>
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
function toSlug(s: string) {
  return s.toLowerCase().replace(/[\s]+/g, "-").replace(/[^a-z0-9а-яё-]/gi, "").slice(0, 80);
}
