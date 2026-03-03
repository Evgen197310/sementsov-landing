"use client";

import { useEffect, useState } from "react";
import { Plus, Pencil, Trash2, X } from "lucide-react";

const cyr: Record<string, string> = {
  а:"a",б:"b",в:"v",г:"g",д:"d",е:"e",ё:"yo",ж:"zh",з:"z",и:"i",й:"y",к:"k",
  л:"l",м:"m",н:"n",о:"o",п:"p",р:"r",с:"s",т:"t",у:"u",ф:"f",х:"kh",ц:"ts",
  ч:"ch",ш:"sh",щ:"shch",ъ:"",ы:"y",ь:"",э:"e",ю:"yu",я:"ya",
};
function toSlug(s: string) {
  return s.toLowerCase().split("").map(c => cyr[c] ?? c).join("")
    .replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "").replace(/-+/g, "-").replace(/^-|-$/g, "");
}

interface TeamMember {
  id: number;
  name: string;
  slug: string;
  position: string;
  specialization: string;
  bio: string;
  education: string;
  experience: string;
  photo: string;
  website: string;
  order: number;
}

const empty: Omit<TeamMember, "id"> = {
  name: "", slug: "", position: "", specialization: "", bio: "", education: "", experience: "", photo: "", website: "", order: 0,
};

export default function AdminTeamPage() {
  const [items, setItems] = useState<TeamMember[]>([]);
  const [editing, setEditing] = useState<Partial<TeamMember> | null>(null);
  const [loading, setLoading] = useState(true);

  const load = () => {
    setLoading(true);
    fetch("/api/team").then((r) => r.json()).then(setItems).finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  const save = async () => {
    if (!editing) return;
    const method = editing.id ? "PUT" : "POST";
    const url = editing.id ? `/api/team/${editing.id}` : "/api/team";
    await fetch(url, { method, headers: { "Content-Type": "application/json" }, body: JSON.stringify(editing) });
    setEditing(null);
    load();
  };

  const remove = async (id: number) => {
    if (!confirm("Удалить?")) return;
    await fetch(`/api/team/${id}`, { method: "DELETE" });
    load();
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-['Playfair_Display'] font-semibold text-[#f5f3f0]">Команда</h1>
        <button onClick={() => setEditing({ ...empty })} className="flex items-center gap-2 bg-[#c9a962] text-[#0b1c2b] px-4 py-2 rounded-lg text-sm font-medium hover:bg-[#ddc488] transition-colors">
          <Plus className="w-4 h-4" /> Добавить
        </button>
      </div>

      {loading ? (
        <p className="text-[#8b9caa]">Загрузка...</p>
      ) : (
        <div className="space-y-3">
          {items.map((m) => (
            <div key={m.id} className="bg-[#0f2133] border border-[#1e3a51]/30 rounded-xl p-4 flex items-center justify-between gap-4">
              <div className="flex-1 min-w-0">
                <div className="text-[#f5f3f0] font-medium">{m.name}</div>
                <div className="text-[#c9a962] text-sm">{m.position}</div>
                <div className="text-[#5a6f80] text-xs mt-1">{m.specialization}</div>
              </div>
              <div className="flex gap-2 flex-shrink-0">
                <button onClick={() => setEditing(m)} className="p-2 text-[#8b9caa] hover:text-[#c9a962] transition-colors">
                  <Pencil className="w-4 h-4" />
                </button>
                <button onClick={() => remove(m.id)} className="p-2 text-[#8b9caa] hover:text-red-400 transition-colors">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal */}
      {editing && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => setEditing(null)}>
          <div className="bg-[#0b1c2b] border border-[#1e3a51]/50 rounded-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto p-6" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-['Playfair_Display'] font-semibold text-[#f5f3f0]">
                {editing.id ? "Редактировать" : "Добавить"} адвоката
              </h2>
              <button onClick={() => setEditing(null)} className="text-[#8b9caa] hover:text-[#f5f3f0]">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="space-y-4">
              <Field label="Имя" value={editing.name || ""} onChange={(v) => setEditing({ ...editing, name: v, slug: editing.id ? editing.slug : toSlug(v) })} />
              <Field label="Slug" value={editing.slug || ""} onChange={(v) => setEditing({ ...editing, slug: v })} />
              <Field label="Должность" value={editing.position || ""} onChange={(v) => setEditing({ ...editing, position: v })} />
              <Field label="Специализация" value={editing.specialization || ""} onChange={(v) => setEditing({ ...editing, specialization: v })} />
              <Field label="Фото (URL)" value={editing.photo || ""} onChange={(v) => setEditing({ ...editing, photo: v })} />
              <Field label="Образование" value={editing.education || ""} onChange={(v) => setEditing({ ...editing, education: v })} />
              <TextareaField label="Опыт работы" value={editing.experience || ""} onChange={(v) => setEditing({ ...editing, experience: v })} />
              <TextareaField label="Биография" value={editing.bio || ""} onChange={(v) => setEditing({ ...editing, bio: v })} />
              <Field label="Личный сайт (URL)" value={editing.website || ""} onChange={(v) => setEditing({ ...editing, website: v })} />
              <Field label="Порядок" value={String(editing.order || 0)} onChange={(v) => setEditing({ ...editing, order: Number(v) })} type="number" />
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

function Field({ label, value, onChange, type = "text" }: { label: string; value: string; onChange: (v: string) => void; type?: string }) {
  return (
    <div>
      <label className="text-[#8b9caa] text-xs mb-1 block">{label}</label>
      <input type={type} value={value} onChange={(e) => onChange(e.target.value)} className="w-full bg-[#0f2133] border border-[#1e3a51]/50 rounded-lg px-3 py-2.5 text-sm text-[#f5f3f0] focus:border-[#c9a962] focus:outline-none" />
    </div>
  );
}

function TextareaField({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) {
  return (
    <div>
      <label className="text-[#8b9caa] text-xs mb-1 block">{label}</label>
      <textarea value={value} onChange={(e) => onChange(e.target.value)} rows={4} className="w-full bg-[#0f2133] border border-[#1e3a51]/50 rounded-lg px-3 py-2.5 text-sm text-[#f5f3f0] focus:border-[#c9a962] focus:outline-none resize-none" />
    </div>
  );
}
