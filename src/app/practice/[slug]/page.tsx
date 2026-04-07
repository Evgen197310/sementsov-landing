import { prisma } from "@/lib/db";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export const revalidate = 3600;

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const cat = await prisma.practiceCategory.findUnique({ where: { slug } });
  if (!cat) return { title: "Категория не найдена" };
  return { title: `${cat.name} — МКА «Семенцов и Партнёры»` };
}

function stripHtml(html: string): string {
  return html.replace(/<[^>]+>/g, "").trim();
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
              {cat.cases.map((c) => (
                <Link key={c.id} href={`/practice/${cat.slug}/${c.slug}`} className="block bg-[#0f2133] border border-[#1e3a51]/30 rounded-xl p-6 hover:border-[#c9a962]/40 transition-colors group">
                  <h2 className="text-[#f5f3f0] font-semibold mb-2 group-hover:text-[#c9a962] transition-colors">{c.title}</h2>
                  {c.excerpt && <p className="text-[#8b9caa] text-sm mb-3">{c.excerpt}</p>}
                  {c.content && <p className="text-[#8b9caa] text-sm line-clamp-3">{stripHtml(c.content)}</p>}
                  {c.tags && (
                    <div className="flex flex-wrap gap-2 mt-4">
                      {c.tags.split(",").map((tag) => (
                        <span key={tag} className="text-[10px] bg-[#1e3a51]/50 text-[#8b9caa] px-2 py-0.5 rounded">
                          {tag.trim()}
                        </span>
                      ))}
                    </div>
                  )}
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  );
}
