import Link from "next/link";
import { prisma } from "@/lib/db";
import { ArrowRight } from "lucide-react";

export const revalidate = 3600;
export const metadata = { title: "Коллегия в СМИ — МКА «Семенцов и Партнёры»" };

export default async function MediaPressPage() {
  const categories = await prisma.mediaCategory.findMany({
    include: { articles: true },
  });
  const uncategorized = await prisma.mediaArticle.findMany({
    where: { categoryId: null },
    orderBy: { createdAt: "desc" },
  });

  return (
    <>
      <section className="bg-gradient-to-b from-[#071420] to-[#0b1c2b] py-16 md:py-24">
        <div className="container mx-auto px-4 max-w-6xl">
          <h1 className="text-3xl md:text-5xl font-['Playfair_Display'] font-bold text-[#f5f3f0] mb-4">
            Коллегия в СМИ
          </h1>
          <div className="decorative-line" />
        </div>
      </section>
      <section className="section-padding">
        <div className="container mx-auto px-4 max-w-6xl">
          <h2 className="text-2xl font-['Playfair_Display'] font-semibold text-[#f5f3f0] mb-6">Категории дел</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            {categories.map((cat) => (
              <Link
                key={cat.id}
                href={`/media/press/${cat.slug}`}
                className="bg-[#0f2133] border border-[#1e3a51]/30 rounded-xl p-6 hover:border-[#c9a962]/30 transition-all card-enhanced group"
              >
                <h3 className="text-[#f5f3f0] font-semibold group-hover:text-[#c9a962] transition-colors mb-2">
                  {cat.name}
                </h3>
                {cat.description && <p className="text-[#8b9caa] text-sm line-clamp-2 mb-3">{cat.description}</p>}
                <div className="flex items-center justify-between">
                  <span className="text-[#5a6f80] text-xs">{cat.articles.length} статей</span>
                  <ArrowRight className="w-4 h-4 text-[#3d4f5f] group-hover:text-[#c9a962] transition-colors" />
                </div>
              </Link>
            ))}
          </div>

          {uncategorized.length > 0 && (
            <>
              <h2 className="text-2xl font-['Playfair_Display'] font-semibold text-[#f5f3f0] mb-6">Публикации</h2>
              <div className="space-y-4">
                {uncategorized.map((a) => (
                  <div key={a.id} className="bg-[#0f2133] border border-[#1e3a51]/30 rounded-xl p-6">
                    <div className="text-[#5a6f80] text-xs mb-2">{a.createdAt.toLocaleDateString("ru-RU")}</div>
                    <h3 className="text-[#f5f3f0] font-semibold">{a.title}</h3>
                    {a.excerpt && <p className="text-[#8b9caa] text-sm mt-2">{a.excerpt}</p>}
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </section>
    </>
  );
}
