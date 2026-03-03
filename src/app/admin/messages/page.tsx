"use client";

import { useEffect, useState } from "react";
import { CheckCircle, Trash2 } from "lucide-react";

interface Msg {
  id: number;
  name: string;
  email: string;
  phone: string;
  service: string;
  message: string;
  read: boolean;
  createdAt: string;
}

export default function AdminMessagesPage() {
  const [items, setItems] = useState<Msg[]>([]);
  const [loading, setLoading] = useState(true);

  const load = () => {
    setLoading(true);
    fetch("/api/contact").then((r) => r.json()).then(setItems).finally(() => setLoading(false));
  };
  useEffect(() => { load(); }, []);

  const markRead = async (id: number) => {
    await fetch(`/api/contact/${id}`, { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ read: true }) });
    load();
  };

  const remove = async (id: number) => {
    if (!confirm("Удалить заявку?")) return;
    await fetch(`/api/contact/${id}`, { method: "DELETE" });
    load();
  };

  return (
    <div>
      <h1 className="text-2xl font-['Playfair_Display'] font-semibold text-[#f5f3f0] mb-6">
        Заявки ({items.length})
      </h1>
      {loading ? <p className="text-[#8b9caa]">Загрузка...</p> : items.length === 0 ? (
        <p className="text-[#8b9caa]">Заявок пока нет.</p>
      ) : (
        <div className="space-y-4">
          {items.map((m) => (
            <div key={m.id} className={`bg-[#0f2133] border rounded-xl p-5 ${m.read ? "border-[#1e3a51]/30" : "border-[#c9a962]/30"}`}>
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="text-[#f5f3f0] font-medium">{m.name}</span>
                    {!m.read && <span className="text-[10px] bg-[#c9a962] text-[#0b1c2b] px-2 py-0.5 rounded-full font-bold">Новая</span>}
                  </div>
                  <p className="text-[#8b9caa] text-sm">{m.email} {m.phone && `• ${m.phone}`}</p>
                  {m.service && <p className="text-[#5a6f80] text-xs mt-1">Услуга: {m.service}</p>}
                  <p className="text-[#c5cdd5] text-sm mt-3 whitespace-pre-line">{m.message}</p>
                </div>
                <div className="flex flex-col gap-2 flex-shrink-0 items-end">
                  <span className="text-[#5a6f80] text-xs">
                    {new Date(m.createdAt).toLocaleDateString("ru-RU")}
                  </span>
                  <div className="flex gap-1">
                    {!m.read && (
                      <button onClick={() => markRead(m.id)} className="p-1.5 text-[#8b9caa] hover:text-green-400" title="Пометить прочитанной">
                        <CheckCircle className="w-4 h-4" />
                      </button>
                    )}
                    <button onClick={() => remove(m.id)} className="p-1.5 text-[#8b9caa] hover:text-red-400" title="Удалить">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
