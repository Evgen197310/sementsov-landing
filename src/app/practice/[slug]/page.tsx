import { prisma } from "@/lib/db";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, FileText, ImageIcon } from "lucide-react";

export const revalidate = 3600;

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const cat = await prisma.practiceCategory.findUnique({ where: { slug } });
  if (!cat) return { title: "Категория не найдена" };
  return { title: `${cat.name} — МКА «Семенцов и Партнёры»` };
}

function hasPdfAttachment(attachments: string): boolean {
  try {
    const items = JSON.parse(attachments || "[]");
    return items.some((i: { originalName?: string; name?: string; url?: string }) => {
      const n = i.originalName || i.name || i.url || "";
      return n.toLowerCase().endsWith(".pdf");
    });
  } catch { return false; }
}

function hasImages(content: string): boolean {
  return (content.match(/<img/g) || []).length > 1;
}

export default async function PracticeCategoryPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const cat = await prisma.practiceCategory.findUnique({
    where: { slug },
    include: { cases: { orderBy: { createdAt: "desc" } } },
  });
  if (!cat) notFound();

  return (
    <>
      <section className="bg-gradient-to-b from-[#071420] to-[#0b1c2b] py-16 md:py-24">
        <div className="container mx-auto px-4 max-w-5xl">
          <Link href="/practice" className="inline-flex items-center gap-2 text-[#8b9caa] hover:text-[#c9a962] transition-colors text-sm mb-8">
            <ArrowLeft className="w-4 h-4" /> Практика
          </Link>
          <h1 className="text-2xl md:text-4xl font-['Playfair_Display'] font-bold text-[#f5f3f0] mb-4">
            {cat.name}
          </h1>
          <div className="decorative-line mb-4" />
          {cat.description && <p className="text-[#8b9caa] max-w-2xl">{cat.description}</p>}
        </div>
      </section>
      <section className="section-padding">
        <div className="container mx-auto px-4 max-w-5xl">
          {cat.cases.length === 0 ? (
            <p className="text-[#8b9caa]">В данной категории пока нет дел.</p>
          ) : (
            <div className="space-y-4">
              {cat.cases.map((c) => {
                const isPdf = hasPdfAttachment(c.attachments);
                const isScans = hasImages(c.content);
                return (
                  <Link
                    key={c.id}
                    href={`/practice/${cat.slug}/${c.slug}`}
                    className="flex gap-4 md:gap-6 bg-[#0f2133] border border-[#1e3a51]/30 rounded-xl p-4 md:p-6 hover:border-[#c9a962]/40 transition-colors group"
                  >
                    {/* Thumbnail */}
                    <div className="flex-shrink-0 w-20 h-20 md:w-28 md:h-28 rounded-lg overflow-hidden bg-[#0b1c2b] flex items-center justify-center">
                      {c.thumbnail ? (
                        /* eslint-disable-next-line @next/next/no-img-element */
                        <img src={c.thumbnail} alt="" className="w-full h-full object-cover" />
                      ) : isPdf ? (
                        <FileText className="w-8 h-8 text-red-400" />
                      ) : isScans ? (
                        <ImageIcon className="w-8 h-8 text-blue-400" />
                      ) : (
                        <FileText className="w-8 h-8 text-[#1e3a51]" />
                      )}
                    </div>

                    {/* Text */}
                    <div className="flex-1 min-w-0">
                      <h2 className="text-[#f5f3f0] font-semibold mb-1 group-hover:text-[#c9a962] transition-colors line-clamp-2">
                        {c.title}
                      </h2>
                      {c.excerpt && (
                        <p className="text-[#8b9caa] text-sm mb-2 line-clamp-2">{c.excerpt}</p>
                      )}
                      <div className="flex items-center gap-3 text-xs text-[#5a6f80]">
                        {isPdf && <span className="flex items-center gap-1"><FileText className="w-3 h-3" /> PDF</span>}
                        {isScans && <span className="flex items-center gap-1"><ImageIcon className="w-3 h-3" /> Сканы</span>}
                      </div>
                      {c.tags && (
                        <div className="flex flex-wrap gap-1.5 mt-2">
                          {c.tags.split(",").slice(0, 3).map((tag) => (
                            <span key={tag} className="text-[10px] bg-[#1e3a51]/50 text-[#8b9caa] px-2 py-0.5 rounded">
                              {tag.trim()}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </Link>
                );
              })}
            </div>
          )}
        </div>
      </section>
    </>
  );
}
