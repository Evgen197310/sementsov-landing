import Link from "next/link";
import { prisma } from "@/lib/db";
import { ArrowRight } from "lucide-react";

export const revalidate = 3600;
export const metadata = { title: "Практика и результаты — МКА «Семенцов и Партнёры»" };

export default async function PracticePage() {
  const categories = await prisma.practiceCategory.findMany({
    include: { cases: true },
  });
  const uncategorized = await prisma.practiceCase.findMany({ where: { categoryId: null } });

  return (
    <>
      <section className="bg-gradient-to-b from-[#071420] to-[#0b1c2b] py-16 md:py-24">
        <div className="container mx-auto px-4 max-w-6xl">
          <h1 className="text-3xl md:text-5xl font-['Playfair_Display'] font-bold text-[#f5f3f0] mb-4">
            Практика и результаты
          </h1>
          <div className="decorative-line mb-6" />
          <p className="text-[#8b9caa] max-w-2xl">
            Судебная практика адвокатов «Семенцов и партнёры» в высших судебных инстанциях России и Европы
          </p>
        </div>
      </section>
      <section className="section-padding">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="grid sm:grid-cols-2 gap-6 mb-12">
            {categories.map((cat) => (
              <Link
                key={cat.id}
                href={`/practice/${cat.slug}`}
                className="bg-[#0f2133] border border-[#1e3a51]/30 rounded-xl p-6 hover:border-[#c9a962]/30 transition-all card-enhanced group"
              >
                <h2 className="text-[#f5f3f0] font-semibold group-hover:text-[#c9a962] transition-colors mb-2">
                  {cat.name}
                </h2>
                {cat.description && (
                  <p className="text-[#8b9caa] text-sm mb-3 line-clamp-2">{cat.description}</p>
                )}
                <div className="flex items-center justify-between">
                  <span className="text-[#5a6f80] text-xs">{cat.cases.length} дел</span>
                  <ArrowRight className="w-4 h-4 text-[#3d4f5f] group-hover:text-[#c9a962] transition-colors" />
                </div>
              </Link>
            ))}
          </div>
          {uncategorized.length > 0 && (
            <div>
              <h2 className="text-xl font-['Playfair_Display'] font-semibold text-[#f5f3f0] mb-4">Другие дела</h2>
              <div className="space-y-3">
                {uncategorized.map((c) => (
                  <div key={c.id} className="bg-[#0f2133] border border-[#1e3a51]/30 rounded-lg p-4">
                    <h3 className="text-[#c5cdd5] text-sm font-medium">{c.title}</h3>
                    {c.tags && (
                      <div className="flex flex-wrap gap-2 mt-2">
                        {c.tags.split(",").map((tag) => (
                          <span key={tag} className="text-[10px] bg-[#1e3a51]/50 text-[#8b9caa] px-2 py-0.5 rounded">
                            {tag.trim()}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </section>
    </>
  );
}
