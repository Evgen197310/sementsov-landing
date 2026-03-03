import { prisma } from "@/lib/db";

export default async function AdminMessagesPage() {
  const messages = await prisma.contactMessage.findMany({ orderBy: { createdAt: "desc" } });

  return (
    <div>
      <h1 className="text-2xl font-['Playfair_Display'] font-semibold text-[#f5f3f0] mb-6">
        Заявки ({messages.length})
      </h1>
      {messages.length === 0 ? (
        <p className="text-[#8b9caa]">Заявок пока нет.</p>
      ) : (
        <div className="space-y-4">
          {messages.map((m) => (
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
                <span className="text-[#5a6f80] text-xs flex-shrink-0">
                  {m.createdAt.toLocaleDateString("ru-RU")}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
