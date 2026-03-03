import { prisma } from "@/lib/db";
import { ExternalLink } from "lucide-react";

export const metadata = { title: "Партнёры — МКА «Семенцов и Партнёры»" };

export default async function PartnersPage() {
  const partners = await prisma.partner.findMany({ orderBy: { order: "asc" } });

  return (
    <>
      <section className="bg-gradient-to-b from-[#071420] to-[#0b1c2b] py-16 md:py-24">
        <div className="container mx-auto px-4 max-w-5xl">
          <h1 className="text-3xl md:text-5xl font-['Playfair_Display'] font-bold text-[#f5f3f0] mb-4">
            Партнёры
          </h1>
          <div className="decorative-line mb-6" />
          <p className="text-[#8b9caa] max-w-2xl">
            Наша коллегия находится в партнёрских отношениях с адвокатскими образованиями Европы и Америки
          </p>
        </div>
      </section>
      <section className="section-padding">
        <div className="container mx-auto px-4 max-w-5xl">
          <div className="space-y-6">
            {partners.map((p) => (
              <div key={p.id} className="bg-[#0f2133] border border-[#1e3a51]/30 rounded-xl p-6">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h2 className="text-[#f5f3f0] font-semibold text-lg">{p.name}</h2>
                    {p.description && <p className="text-[#8b9caa] text-sm mt-2 leading-relaxed">{p.description}</p>}
                    {p.email && (
                      <p className="text-[#8b9caa] text-sm mt-2">
                        <span className="text-[#5a6f80]">Email:</span>{" "}
                        <a href={`mailto:${p.email}`} className="hover:text-[#c9a962] transition-colors">{p.email}</a>
                      </p>
                    )}
                  </div>
                  {p.website && (
                    <a
                      href={p.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-shrink-0 p-2 text-[#5a6f80] hover:text-[#c9a962] transition-colors"
                      title="Перейти на сайт"
                    >
                      <ExternalLink className="w-5 h-5" />
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
