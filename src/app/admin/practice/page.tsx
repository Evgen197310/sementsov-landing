"use client";

import { useEffect, useState } from "react";
import { Plus, Pencil, Trash2, X, ChevronDown, ChevronRight } from "lucide-react";
import { FileAttachments } from "@/components/admin/FileAttachments";
import AiDropZone from "@/components/admin/AiDropZone";

interface PracticeCase {
  id: number;
  title: string;
  slug: string;
  content: string;
  excerpt: string;
  situation: string;
  actions: string;
  result: string;
  tags: string;
  thumbnail: string;
  attachments: string;
  categoryId: number | null;
}

interface PracticeCategory {
  id: number;
  name: string;
  slug: string;
  description: string;
  attachments: string;
  cases: PracticeCase[];
}

type EditingCat = Partial<PracticeCategory> & { _type: "category" };
type EditingCase = Partial<PracticeCase> & { _type?: "case" };

export default function AdminPracticePage() {
  const [data, setData] = useState<{ categories: PracticeCategory[]; uncategorized: PracticeCase[] }>({ categories: [], uncategorized: [] });
  const [loading, setLoading] = useState(true);
  const [editingCat, setEditingCat] = useState<EditingCat | null>(null);
  const [editingCase, setEditingCase] = useState<EditingCase | null>(null);
  const [expanded, setExpanded] = useState<Set<number>>(new Set());

  const load = () => {
    setLoading(true);
    fetch("/api/practice").then((r) => r.json()).then(setData).finally(() => setLoading(false));
  };
  useEffect(() => { load(); }, []);

  const toggle = (id: number) => {
    setExpanded((prev) => { const s = new Set(prev); s.has(id) ? s.delete(id) : s.add(id); return s; });
  };

  const saveCat = async () => {
    if (!editingCat) return;
    const method = editingCat.id ? "PUT" : "POST";
    const url = editingCat.id ? `/api/practice/${editingCat.id}` : "/api/practice";
    await fetch(url, { method, headers: { "Content-Type": "application/json" }, body: JSON.stringify({ ...editingCat, _type: "category" }) });
    setEditingCat(null);
    load();
  };

  const removeCat = async (id: number) => {
    if (!confirm("Удалить категорию? Дела станут без категории.")) return;
    await fetch(`/api/practice/${id}?type=category`, { method: "DELETE" });
    load();
  };

  const saveCase = async () => {
    if (!editingCase) return;
    const method = editingCase.id ? "PUT" : "POST";
    const url = editingCase.id ? `/api/practice/${editingCase.id}` : "/api/practice";
    await fetch(url, { method, headers: { "Content-Type": "application/json" }, body: JSON.stringify(editingCase) });
    setEditingCase(null);
    load();
  };

  const removeCase = async (id: number) => {
    if (!confirm("Удалить дело?")) return;
    await fetch(`/api/practice/${id}`, { method: "DELETE" });
    load();
  };

  const emptyCase = (catId?: number): EditingCase => ({ title: "", slug: "", content: "", excerpt: "", situation: "", actions: "", result: "", tags: "", thumbnail: "", attachments: "", categoryId: catId ?? null });

  const handleAiResult = (data: Record<string, unknown>) => {
    const catSlug = data.categorySlug as string || "";
    const matchedCat = allCategories.find((c) => c.slug === catSlug);
    setEditingCase({
      title: (data.title as string) || "",
      slug: toSlug((data.title as string) || ""),
      content: (data.content as string) || "",
      excerpt: (data.excerpt as string) || "",
      situation: (data.situation as string) || "",
      actions: (data.actions as string) || "",
      result: (data.result as string) || "",
      tags: (data.tags as string) || "",
      thumbnail: "",
      attachments: "",
      categoryId: matchedCat?.id ?? allCategories[0]?.id ?? null,
    });
  };
  const allCategories = data.categories;

  return (
    <div>
      <AiDropZone onResult={handleAiResult} />

      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-['Playfair_Display'] font-semibold text-[#f5f3f0]">Практика</h1>
        <div className="flex gap-2">
          <button onClick={() => setEditingCat({ name: "", slug: "", description: "", _type: "category" })} className="flex items-center gap-2 bg-[#1e3a51]/50 text-[#c9a962] px-3 py-2 rounded-lg text-sm font-medium hover:bg-[#1e3a51] transition-colors">
            <Plus className="w-4 h-4" /> Категория
          </button>
          <button onClick={() => setEditingCase(emptyCase(allCategories[0]?.id))} className="flex items-center gap-2 bg-[#c9a962] text-[#0b1c2b] px-4 py-2 rounded-lg text-sm font-medium hover:bg-[#ddc488] transition-colors">
            <Plus className="w-4 h-4" /> Дело
          </button>
        </div>
      </div>

      {loading ? <p className="text-[#8b9caa]">Загрузка...</p> : (
        <>
          <div className="space-y-4 mb-8">
            {allCategories.map((cat) => (
              <div key={cat.id} className="bg-[#0f2133] border border-[#1e3a51]/30 rounded-xl overflow-hidden">
                <div className="flex items-center justify-between p-4 cursor-pointer" onClick={() => toggle(cat.id)}>
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    {expanded.has(cat.id) ? <ChevronDown className="w-4 h-4 text-[#c9a962]" /> : <ChevronRight className="w-4 h-4 text-[#5a6f80]" />}
                    <div>
                      <h3 className="text-[#f5f3f0] font-semibold">{cat.name}</h3>
                      <p className="text-[#5a6f80] text-xs">/{cat.slug} • {cat.cases.length} дел</p>
                    </div>
                  </div>
                  <div className="flex gap-1 flex-shrink-0" onClick={(e) => e.stopPropagation()}>
                    <button onClick={() => setEditingCat({ ...cat, _type: "category" })} className="p-2 text-[#8b9caa] hover:text-[#c9a962]"><Pencil className="w-4 h-4" /></button>
                    <button onClick={() => removeCat(cat.id)} className="p-2 text-[#8b9caa] hover:text-red-400"><Trash2 className="w-4 h-4" /></button>
                  </div>
                </div>
                {expanded.has(cat.id) && (
                  <div className="border-t border-[#1e3a51]/20 px-4 pb-4">
                    {cat.cases.length === 0 ? (
                      <p className="text-[#5a6f80] text-sm py-3">Нет дел</p>
                    ) : (
                      <div className="space-y-2 pt-3">
                        {cat.cases.map((c) => (
                          <div key={c.id} className="flex items-center justify-between gap-3 bg-[#0b1c2b]/50 rounded-lg px-3 py-2.5">
                            <div className="flex-1 min-w-0">
                              <div className="text-[#f5f3f0] text-sm font-medium truncate">{c.title}</div>
                              <div className="text-[#5a6f80] text-xs mt-0.5">/{c.slug}{c.result && ` • ${c.result.slice(0, 50)}`}</div>
                            </div>
                            <div className="flex gap-1 flex-shrink-0">
                              <button onClick={() => setEditingCase(c)} className="p-1.5 text-[#8b9caa] hover:text-[#c9a962]"><Pencil className="w-3.5 h-3.5" /></button>
                              <button onClick={() => removeCase(c.id)} className="p-1.5 text-[#8b9caa] hover:text-red-400"><Trash2 className="w-3.5 h-3.5" /></button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                    <button onClick={() => setEditingCase(emptyCase(cat.id))} className="mt-3 text-xs text-[#c9a962] hover:text-[#ddc488] flex items-center gap-1">
                      <Plus className="w-3 h-3" /> Добавить дело в эту категорию
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>

          {data.uncategorized.length > 0 && (
            <>
              <h2 className="text-lg font-semibold text-[#c9a962] mb-3">Без категории</h2>
              <div className="space-y-2">
                {data.uncategorized.map((c) => (
                  <div key={c.id} className="bg-[#0f2133] border border-[#1e3a51]/30 rounded-lg p-4 flex items-center justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="text-[#f5f3f0] text-sm font-medium truncate">{c.title}</div>
                      <div className="text-[#5a6f80] text-xs mt-0.5">/{c.slug}</div>
                    </div>
                    <div className="flex gap-1 flex-shrink-0">
                      <button onClick={() => setEditingCase(c)} className="p-2 text-[#8b9caa] hover:text-[#c9a962]"><Pencil className="w-4 h-4" /></button>
                      <button onClick={() => removeCase(c.id)} className="p-2 text-[#8b9caa] hover:text-red-400"><Trash2 className="w-4 h-4" /></button>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </>
      )}

      {/* Category modal */}
      {editingCat && (
        <Modal onClose={() => setEditingCat(null)} title={editingCat.id ? "Редактировать категорию" : "Новая категория"}>
          <div className="space-y-4">
            <Inp label="Название" value={editingCat.name || ""} onChange={(v) => setEditingCat({ ...editingCat, name: v, slug: editingCat.slug || toSlug(v) })} />
            <Inp label="Slug" value={editingCat.slug || ""} onChange={(v) => setEditingCat({ ...editingCat, slug: v })} />
            <Txt label="Описание" value={editingCat.description || ""} onChange={(v) => setEditingCat({ ...editingCat, description: v })} rows={3} />
            <FileAttachments value={editingCat.attachments || ""} onChange={(v) => setEditingCat({ ...editingCat, attachments: v })} />
            <button onClick={saveCat} className="w-full bg-[#c9a962] text-[#0b1c2b] py-3 rounded-lg font-medium hover:bg-[#ddc488] transition-colors">Сохранить</button>
          </div>
        </Modal>
      )}

      {/* Case modal */}
      {editingCase && (
        <Modal onClose={() => setEditingCase(null)} title={editingCase.id ? "Редактировать дело" : "Новое дело"}>
          <div className="space-y-4">
            <Inp label="Заголовок" value={editingCase.title || ""} onChange={(v) => setEditingCase({ ...editingCase, title: v, slug: editingCase.slug || toSlug(v) })} />
            <Inp label="Slug" value={editingCase.slug || ""} onChange={(v) => setEditingCase({ ...editingCase, slug: v })} />
            <div>
              <label className="text-[#8b9caa] text-xs mb-1 block">Категория</label>
              <select
                value={editingCase.categoryId ?? ""}
                onChange={(e) => setEditingCase({ ...editingCase, categoryId: e.target.value ? Number(e.target.value) : null })}
                className="w-full bg-[#0f2133] border border-[#1e3a51]/50 rounded-lg px-3 py-2.5 text-sm text-[#f5f3f0] focus:border-[#c9a962] focus:outline-none"
              >
                <option value="">Без категории</option>
                {allCategories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
            </div>
            <Txt label="Превью" value={editingCase.excerpt || ""} onChange={(v) => setEditingCase({ ...editingCase, excerpt: v })} rows={2} />
            <Txt label="Ситуация" value={editingCase.situation || ""} onChange={(v) => setEditingCase({ ...editingCase, situation: v })} rows={3} />
            <Txt label="Действия" value={editingCase.actions || ""} onChange={(v) => setEditingCase({ ...editingCase, actions: v })} rows={3} />
            <Txt label="Результат" value={editingCase.result || ""} onChange={(v) => setEditingCase({ ...editingCase, result: v })} rows={3} />
            <Inp label="Теги (через запятую)" value={editingCase.tags || ""} onChange={(v) => setEditingCase({ ...editingCase, tags: v })} />
            <Inp label="Миниатюра (URL)" value={editingCase.thumbnail || ""} onChange={(v) => setEditingCase({ ...editingCase, thumbnail: v })} />
            <Txt label="Содержимое (HTML)" value={editingCase.content || ""} onChange={(v) => setEditingCase({ ...editingCase, content: v })} />
            <FileAttachments value={editingCase.attachments || ""} onChange={(v) => setEditingCase({ ...editingCase, attachments: v })} />
            <button onClick={saveCase} className="w-full bg-[#c9a962] text-[#0b1c2b] py-3 rounded-lg font-medium hover:bg-[#ddc488] transition-colors">Сохранить</button>
          </div>
        </Modal>
      )}
    </div>
  );
}

function Modal({ children, onClose, title }: { children: React.ReactNode; onClose: () => void; title: string }) {
  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-[#0b1c2b] border border-[#1e3a51]/50 rounded-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto p-6" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-['Playfair_Display'] font-semibold text-[#f5f3f0]">{title}</h2>
          <button onClick={onClose} className="text-[#8b9caa] hover:text-[#f5f3f0]"><X className="w-5 h-5" /></button>
        </div>
        {children}
      </div>
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

function Txt({ label, value, onChange, rows = 8 }: { label: string; value: string; onChange: (v: string) => void; rows?: number }) {
  return (
    <div>
      <label className="text-[#8b9caa] text-xs mb-1 block">{label}</label>
      <textarea value={value} onChange={(e) => onChange(e.target.value)} rows={rows} className="w-full bg-[#0f2133] border border-[#1e3a51]/50 rounded-lg px-3 py-2.5 text-sm text-[#f5f3f0] focus:border-[#c9a962] focus:outline-none resize-none" />
    </div>
  );
}

function toSlug(s: string) {
  return s.toLowerCase().replace(/[\s]+/g, "-").replace(/[^a-z0-9а-яё-]/gi, "").slice(0, 80);
}
