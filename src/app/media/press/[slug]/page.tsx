import { prisma } from "@/lib/db";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";

const PER_PAGE = 20;

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const cat = await prisma.mediaCategory.findUnique({ where: { slug } });
  if (!cat) return { title: "Категория не найдена" };
  return { title: `${cat.name} — МКА «Семенцов и Партнёры»` };
}

export default async function MediaCategoryPage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ page?: string }>;
}) {
  const { slug } = await params;
  const sp = await searchParams;
  const page = Math.max(1, parseInt(sp.page || "1", 10) || 1);

  const cat = await prisma.mediaCategory.findUnique({ where: { slug } });
  if (!cat) notFound();

  const totalCount = await prisma.mediaArticle.count({ where: { categoryId: cat.id } });
  const totalPages = Math.max(1, Math.ceil(totalCount / PER_PAGE));
  const currentPage = Math.min(page, totalPages);

  const articles = await prisma.mediaArticle.findMany({
    where: { categoryId: cat.id },
    orderBy: { createdAt: "desc" },
    skip: (currentPage - 1) * PER_PAGE,
    take: PER_PAGE,
  });

  return (
    <>
      <section className="bg-gradient-to-b from-[#071420] to-[#0b1c2b] py-16 md:py-24">
        <div className="container mx-auto px-4 max-w-5xl">
          <Link href="/media/press" className="inline-flex items-center gap-2 text-[#8b9caa] hover:text-[#c9a962] transition-colors text-sm mb-8">
            <ArrowLeft className="w-4 h-4" /> Коллегия в СМИ
          </Link>
          <h1 className="text-2xl md:text-4xl font-['Playfair_Display'] font-bold text-[#f5f3f0] mb-4">
            {cat.name}
          </h1>
          <div className="decorative-line mb-4" />
          {cat.description && <p className="text-[#8b9caa] max-w-2xl">{cat.description}</p>}
          <p className="text-[#5a6f80] text-sm mt-2">{totalCount} публикаций</p>
        </div>
      </section>
      <section className="section-padding">
        <div className="container mx-auto px-4 max-w-5xl">
          {articles.length === 0 ? (
            <p className="text-[#8b9caa]">В данной категории пока нет публикаций.</p>
          ) : (
            <div className="space-y-4">
              {articles.map((a) => (
                <Link key={a.id} href={`/media/press/article/${a.slug}`} className="block bg-[#0f2133] border border-[#1e3a51]/30 rounded-xl p-6 hover:border-[#c9a962]/30 transition-all group">
                  <div className="text-[#5a6f80] text-xs mb-2">{a.createdAt.toLocaleDateString("ru-RU")}</div>
                  <h2 className="text-[#f5f3f0] font-semibold group-hover:text-[#c9a962] transition-colors">{a.title}</h2>
                  {a.excerpt && <p className="text-[#8b9caa] text-sm mt-2 line-clamp-2">{a.excerpt}</p>}
                  <span className="inline-flex items-center gap-1 text-[#c9a962] text-sm mt-3 opacity-0 group-hover:opacity-100 transition-opacity">
                    Читать полностью <ArrowRight className="w-3 h-3" />
                  </span>
                </Link>
              ))}
            </div>
          )}

          {totalPages > 1 && (
            <nav className="flex items-center justify-center gap-2 mt-10">
              {currentPage > 1 ? (
                <Link href={`/media/press/${slug}?page=${currentPage - 1}`} className="flex items-center justify-center w-10 h-10 rounded-lg bg-[#0f2133] border border-[#1e3a51]/30 text-[#8b9caa] hover:border-[#c9a962]/30 hover:text-[#c9a962] transition-all">
                  <ChevronLeft className="w-4 h-4" />
                </Link>
              ) : (
                <span className="flex items-center justify-center w-10 h-10 rounded-lg bg-[#0f2133]/50 text-[#3d4f5f]">
                  <ChevronLeft className="w-4 h-4" />
                </span>
              )}
              {Array.from({ length: totalPages }, (_, i) => i + 1)
                .filter((p) => p === 1 || p === totalPages || Math.abs(p - currentPage) <= 2)
                .reduce<(number | "...")[]>((acc, p, idx, arr) => {
                  if (idx > 0 && p - (arr[idx - 1] as number) > 1) acc.push("...");
                  acc.push(p);
                  return acc;
                }, [])
                .map((p, idx) =>
                  p === "..." ? (
                    <span key={`dots-${idx}`} className="text-[#5a6f80] px-1">&hellip;</span>
                  ) : (
                    <Link
                      key={p}
                      href={`/media/press/${slug}?page=${p}`}
                      className={`flex items-center justify-center w-10 h-10 rounded-lg border transition-all text-sm font-medium ${
                        p === currentPage
                          ? "bg-[#c9a962]/20 border-[#c9a962]/40 text-[#c9a962]"
                          : "bg-[#0f2133] border-[#1e3a51]/30 text-[#8b9caa] hover:border-[#c9a962]/30 hover:text-[#c9a962]"
                      }`}
                    >
                      {p}
                    </Link>
                  )
                )}
              {currentPage < totalPages ? (
                <Link href={`/media/press/${slug}?page=${currentPage + 1}`} className="flex items-center justify-center w-10 h-10 rounded-lg bg-[#0f2133] border border-[#1e3a51]/30 text-[#8b9caa] hover:border-[#c9a962]/30 hover:text-[#c9a962] transition-all">
                  <ChevronRight className="w-4 h-4" />
                </Link>
              ) : (
                <span className="flex items-center justify-center w-10 h-10 rounded-lg bg-[#0f2133]/50 text-[#3d4f5f]">
                  <ChevronRight className="w-4 h-4" />
                </span>
              )}
            </nav>
          )}
        </div>
      </section>
    </>
  );
}
