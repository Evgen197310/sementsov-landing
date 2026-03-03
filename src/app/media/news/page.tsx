import { prisma } from "@/lib/db";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

export const revalidate = 3600;
export const metadata = { title: "Новости — МКА «Семенцов и Партнёры»" };

const PER_PAGE = 20;

export default async function NewsPage({ searchParams }: { searchParams: Promise<{ page?: string }> }) {
  const params = await searchParams;
  const page = Number(params.page) || 1;
  const skip = (page - 1) * PER_PAGE;

  const [articles, total] = await Promise.all([
    prisma.newsArticle.findMany({
      where: { section: "news" },
      orderBy: { createdAt: "desc" },
      skip,
      take: PER_PAGE,
    }),
    prisma.newsArticle.count({ where: { section: "news" } }),
  ]);

  const totalPages = Math.ceil(total / PER_PAGE);

  return (
    <>
      <section className="bg-gradient-to-b from-[#071420] to-[#0b1c2b] py-16 md:py-24">
        <div className="container mx-auto px-4 max-w-5xl">
          <h1 className="text-3xl md:text-5xl font-['Playfair_Display'] font-bold text-[#f5f3f0] mb-4">
            Новости коллегии
          </h1>
          <div className="decorative-line" />
        </div>
      </section>
      <section className="section-padding">
        <div className="container mx-auto px-4 max-w-5xl">
          <div className="space-y-4">
            {articles.map((a) => (
              <Link
                key={a.id}
                href={`/media/news/${a.slug}`}
                className="block bg-[#0f2133] border border-[#1e3a51]/30 rounded-xl p-6 hover:border-[#c9a962]/30 transition-all group"
              >
                <div className="text-[#5a6f80] text-xs mb-2">
                  {a.createdAt.toLocaleDateString("ru-RU", { year: "numeric", month: "long", day: "numeric" })}
                </div>
                <h2 className="text-[#f5f3f0] font-semibold group-hover:text-[#c9a962] transition-colors mb-2">
                  {a.title}
                </h2>
                {a.excerpt && (
                  <p className="text-[#8b9caa] text-sm line-clamp-3">{a.excerpt}</p>
                )}
                <span className="inline-flex items-center gap-1 text-[#c9a962] text-sm mt-3">
                  Читать полностью <ArrowRight className="w-3.5 h-3.5" />
                </span>
              </Link>
            ))}
          </div>

          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 mt-12">
              {page > 1 && (
                <Link
                  href={`/media/news?page=${page - 1}`}
                  className="px-4 py-2 bg-[#0f2133] border border-[#1e3a51]/30 rounded-lg text-[#c5cdd5] hover:border-[#c9a962]/30 hover:text-[#c9a962] transition-all text-sm"
                >
                  Назад
                </Link>
              )}
              {Array.from({ length: Math.min(totalPages, 10) }, (_, i) => i + 1).map((p) => (
                <Link
                  key={p}
                  href={`/media/news?page=${p}`}
                  className={`px-4 py-2 rounded-lg text-sm transition-all ${
                    p === page
                      ? "bg-[#c9a962] text-[#0b1c2b] font-semibold"
                      : "bg-[#0f2133] border border-[#1e3a51]/30 text-[#c5cdd5] hover:border-[#c9a962]/30 hover:text-[#c9a962]"
                  }`}
                >
                  {p}
                </Link>
              ))}
              {totalPages > 10 && page < totalPages - 5 && (
                <span className="text-[#5a6f80] px-2">...</span>
              )}
              {page < totalPages && (
                <Link
                  href={`/media/news?page=${page + 1}`}
                  className="px-4 py-2 bg-[#0f2133] border border-[#1e3a51]/30 rounded-lg text-[#c5cdd5] hover:border-[#c9a962]/30 hover:text-[#c9a962] transition-all text-sm"
                >
                  Вперёд
                </Link>
              )}
            </div>
          )}
        </div>
      </section>
    </>
  );
}
