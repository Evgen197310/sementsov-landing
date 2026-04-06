"use client";

import { useEffect, useState } from "react";
import { Plus, Pencil, Trash2, X, ChevronDown, ChevronRight } from "lucide-react";
import { FileAttachments } from "@/components/admin/FileAttachments";

interface MediaArticle {
  id: number;
  title: string;
  slug: string;
  content: string;
  excerpt: string;
  source: string;
  tags: string;
  attachments: string;
  categoryId: number | null;
}

interface MediaCategory {
  id: number;
  name: string;
  slug: string;
  description: string;
  attachments: string;
  articles: MediaArticle[];
}

type EditingCat = Partial<MediaCategory> & { _type: "category" };
type EditingArt = Partial<MediaArticle> & { _type?: "article" };

export default function AdminMediaPage() {
  const [data, setData] = useState<{ categories: MediaCategory[]; uncategorized: MediaArticle[] }>({ categories: [], uncategorized: [] });
  const [loading, setLoading] = useState(true);
  const [editingCat, setEditingCat] = useState<EditingCat | null>(null);
  const [editingArt, setEditingArt] = useState<EditingArt | null>(null);
  const [expanded, setExpanded] = useState<Set<number>>(new Set());

  const load = () => {
    setLoading(true);
    fetch("/api/media").then((r) => r.json()).then(setData).finally(() => setLoading(false));
  };
  useEffect(() => { load(); }, []);

  const toggle = (id: number) => {
    setExpanded((prev) => {
      const s = new Set(prev);
      s.has(id) ? s.delete(id) : s.add(id);
      return s;
    });
  };

  const saveCat = async () => {
    if (!editingCat) return;
    const method = editingCat.id ? "PUT" : "POST";
    const url = editingCat.id ? `/api/media/${editingCat.id}` : "/api/media";
    await fetch(url, { method, headers: { "Content-Type": "application/json" }, body: JSON.stringify({ ...editingCat, _type: "category" }) });
    setEditingCat(null);
    load();
  };

  const removeCat = async (id: number) => {
    if (!confirm("Удалить категорию? Статьи станут без категории.")) return;
    await fetch(`/api/media/${id}?type=category`, { method: "DELETE" });
    load();
  };

  const saveArt = async () => {
    if (!editingArt) return;
    const method = editingArt.id ? "PUT" : "POST";
    const url = editingArt.id ? `/api/media/${editingArt.id}` : "/api/media";
    await fetch(url, { method, headers: { "Content-Type": "application/json" }, body: JSON.stringify(editingArt) });
    setEditingArt(null);
    load();
  };

  const removeArt = async (id: number) => {
    if (!confirm("Удалить статью?")) return;
    await fetch(`/api/media/${id}`, { method: "DELETE" });
    load();
  };

  const allCategories = data.categories;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-['Playfair_Display'] font-semibold text-[#f5f3f0]">Коллегия в СМИ</h1>
        <div className="flex gap-2">
          <button onClick={() => setEditingCat({ name: "", slug: "", description: "", _type: "category" })} className="flex items-center gap-2 bg-[#1e3a51]/50 text-[#c9a962] px-3 py-2 rounded-lg text-sm font-medium hover:bg-[#1e3a51] transition-colors">
            <Plus className="w-4 h-4" /> Категория
          </button>
          <button onClick={() => setEditingArt({ title: "", slug: "", content: "", excerpt: "", source: "", tags: "", attachments: "", categoryId: allCategories[0]?.id || null })} className="flex items-center gap-2 bg-[#c9a962] text-[#0b1c2b] px-4 py-2 rounded-lg text-sm font-medium hover:bg-[#ddc488] transition-colors">
            <Plus className="w-4 h-4" /> Статья
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
                      <p className="text-[#5a6f80] text-xs">/{cat.slug} • {cat.articles.length} статей</p>
                    </div>
                  </div>
                  <div className="flex gap-1 flex-shrink-0" onClick={(e) => e.stopPropagation()}>
                    <button onClick={() => setEditingCat({ ...cat, _type: "category" })} className="p-2 text-[#8b9caa] hover:text-[#c9a962]"><Pencil className="w-4 h-4" /></button>
                    <button onClick={() => removeCat(cat.id)} className="p-2 text-[#8b9caa] hover:text-red-400"><Trash2 className="w-4 h-4" /></button>
                  </div>
                </div>
                {expanded.has(cat.id) && (
                  <div className="border-t border-[#1e3a51]/20 px-4 pb-4">
                    {cat.articles.length === 0 ? (
                      <p className="text-[#5a6f80] text-sm py-3">Нет статей</p>
                    ) : (
                      <div className="space-y-2 pt-3">
                        {cat.articles.map((a) => (
                          <div key={a.id} className="flex items-center justify-between gap-3 bg-[#0b1c2b]/50 rounded-lg px-3 py-2.5">
                            <div className="flex-1 min-w-0">
                              <div className="text-[#f5f3f0] text-sm font-medium truncate">{a.title}</div>
                              <div className="text-[#5a6f80] text-xs mt-0.5">{a.source && `${a.source} • `}/{a.slug}</div>
                            </div>
                            <div className="flex gap-1 flex-shrink-0">
                              <button onClick={() => setEditingArt(a)} className="p-1.5 text-[#8b9caa] hover:text-[#c9a962]"><Pencil className="w-3.5 h-3.5" /></button>
                              <button onClick={() => removeArt(a.id)} className="p-1.5 text-[#8b9caa] hover:text-red-400"><Trash2 className="w-3.5 h-3.5" /></button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                    <button
                      onClick={() => setEditingArt({ title: "", slug: "", content: "", excerpt: "", source: "", tags: "", attachments: "", categoryId: cat.id })}
                      className="mt-3 text-xs text-[#c9a962] hover:text-[#ddc488] flex items-center gap-1"
                    >
                      <Plus className="w-3 h-3" /> Добавить статью в эту категорию
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
                {data.uncategorized.map((a) => (
                  <div key={a.id} className="bg-[#0f2133] border border-[#1e3a51]/30 rounded-lg p-4 flex items-center justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="text-[#f5f3f0] text-sm font-medium truncate">{a.title}</div>
                      <div className="text-[#5a6f80] text-xs mt-0.5">{a.source && `${a.source} • `}/{a.slug}</div>
                    </div>
                    <div className="flex gap-1 flex-shrink-0">
                      <button onClick={() => setEditingArt(a)} className="p-2 text-[#8b9caa] hover:text-[#c9a962]"><Pencil className="w-4 h-4" /></button>
                      <button onClick={() => removeArt(a.id)} className="p-2 text-[#8b9caa] hover:text-red-400"><Trash2 className="w-4 h-4" /></button>
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

      {/* Article modal */}
      {editingArt && (
        <Modal onClose={() => setEditingArt(null)} title={editingArt.id ? "Редактировать статью" : "Новая статья"}>
          <div className="space-y-4">
            <Inp label="Заголовок" value={editingArt.title || ""} onChange={(v) => setEditingArt({ ...editingArt, title: v, slug: editingArt.slug || toSlug(v) })} />
            <Inp label="Slug" value={editingArt.slug || ""} onChange={(v) => setEditingArt({ ...editingArt, slug: v })} />
            <div>
              <label className="text-[#8b9caa] text-xs mb-1 block">Категория</label>
              <select
                value={editingArt.categoryId ?? ""}
                onChange={(e) => setEditingArt({ ...editingArt, categoryId: e.target.value ? Number(e.target.value) : null })}
                className="w-full bg-[#0f2133] border border-[#1e3a51]/50 rounded-lg px-3 py-2.5 text-sm text-[#f5f3f0] focus:border-[#c9a962] focus:outline-none"
              >
                <option value="">Без категории</option>
                {allCategories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
            </div>
            <Inp label="Источник" value={editingArt.source || ""} onChange={(v) => setEditingArt({ ...editingArt, source: v })} />
            <Inp label="Превью" value={editingArt.excerpt || ""} onChange={(v) => setEditingArt({ ...editingArt, excerpt: v })} />
            <Inp label="Теги (через запятую)" value={editingArt.tags || ""} onChange={(v) => setEditingArt({ ...editingArt, tags: v })} />
            <Txt label="Содержимое" value={editingArt.content || ""} onChange={(v) => setEditingArt({ ...editingArt, content: v })} />
            <FileAttachments value={editingArt.attachments || ""} onChange={(v) => setEditingArt({ ...editingArt, attachments: v })} />
            <button onClick={saveArt} className="w-full bg-[#c9a962] text-[#0b1c2b] py-3 rounded-lg font-medium hover:bg-[#ddc488] transition-colors">Сохранить</button>
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
