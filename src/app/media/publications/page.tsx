import { prisma } from "@/lib/db";
import { PublicAttachments } from "@/components/PublicAttachments";

export const metadata = { title: "Научные труды — МКА «Семенцов и Партнёры»" };

export default async function PublicationsPage() {
  const pubs = await prisma.publication.findMany({ orderBy: { createdAt: "desc" } });

  return (
    <>
      <section className="bg-gradient-to-b from-[#071420] to-[#0b1c2b] py-16 md:py-24">
        <div className="container mx-auto px-4 max-w-5xl">
          <h1 className="text-3xl md:text-5xl font-['Playfair_Display'] font-bold text-[#f5f3f0] mb-4">
            Научные труды
          </h1>
          <div className="decorative-line mb-6" />
          <p className="text-[#8b9caa] max-w-2xl">Публикации адвокатов МКА «Семенцов и Партнёры»</p>
        </div>
      </section>
      <section className="section-padding">
        <div className="container mx-auto px-4 max-w-5xl">
          {pubs.length === 0 ? (
            <p className="text-[#8b9caa]">Пока нет публикаций.</p>
          ) : (
            <div className="space-y-4">
              {pubs.map((p) => (
                <div key={p.id} className="bg-[#0f2133] border border-[#1e3a51]/30 rounded-xl p-6">
                  <h2 className="text-[#f5f3f0] font-semibold">{p.title}</h2>
                  <p className="text-[#5a6f80] text-xs mt-1">Раздел: {p.section === "kuklin" ? "Куклин В.В." : p.section}</p>
                  {p.content && <div className="text-[#8b9caa] text-sm mt-3 whitespace-pre-line">{p.content}</div>}
                  <PublicAttachments attachments={p.attachments} />
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  );
}
