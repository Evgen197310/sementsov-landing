import { prisma } from "@/lib/db";
import { FileText } from "lucide-react";

export const metadata = { title: "Документы — МКА «Семенцов и Партнёры»" };

export default async function DocumentsPage() {
  const docs = await prisma.document.findMany();

  return (
    <>
      <section className="bg-gradient-to-b from-[#071420] to-[#0b1c2b] py-16 md:py-24">
        <div className="container mx-auto px-4 max-w-5xl">
          <h1 className="text-3xl md:text-5xl font-['Playfair_Display'] font-bold text-[#f5f3f0] mb-4">
            Документы
          </h1>
          <div className="decorative-line" />
        </div>
      </section>
      <section className="section-padding">
        <div className="container mx-auto px-4 max-w-5xl">
          {docs.length === 0 ? (
            <p className="text-[#8b9caa]">Пока нет документов.</p>
          ) : (
            <div className="space-y-4">
              {docs.map((d) => (
                <div key={d.id} className="bg-[#0f2133] border border-[#1e3a51]/30 rounded-xl p-6 flex items-start gap-4">
                  <FileText className="w-6 h-6 text-[#c9a962] flex-shrink-0 mt-0.5" />
                  <div>
                    <h2 className="text-[#f5f3f0] font-semibold">{d.title}</h2>
                    {d.content && <p className="text-[#8b9caa] text-sm mt-2 whitespace-pre-line">{d.content}</p>}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  );
}
