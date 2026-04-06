import { prisma } from "@/lib/db";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, ExternalLink } from "lucide-react";
import { PublicAttachments } from "@/components/PublicAttachments";

export const revalidate = 3600;

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const article = await prisma.mediaArticle.findUnique({ where: { slug } });
  if (!article) return { title: "Публикация не найдена" };
  return { title: `${article.title} — МКА «Семенцов и Партнёры»` };
}

export default async function MediaArticlePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const article = await prisma.mediaArticle.findUnique({
    where: { slug },
    include: { category: true },
  });
  if (!article) notFound();

  const backHref = article.category ? `/media/press/${article.category.slug}` : "/media/press";
  const backLabel = article.category ? article.category.name : "Коллегия в СМИ";

  return (
    <>
      <section className="bg-gradient-to-b from-[#071420] to-[#0b1c2b] py-16 md:py-24">
        <div className="container mx-auto px-4 max-w-4xl">
          <Link href={backHref} className="inline-flex items-center gap-2 text-[#8b9caa] hover:text-[#c9a962] transition-colors text-sm mb-8">
            <ArrowLeft className="w-4 h-4" /> {backLabel}
          </Link>
          <div className="text-[#5a6f80] text-sm mb-4">
            {article.createdAt.toLocaleDateString("ru-RU", { day: "numeric", month: "long", year: "numeric" })}
          </div>
          <h1 className="text-2xl md:text-4xl font-['Playfair_Display'] font-bold text-[#f5f3f0] mb-4">
            {article.title}
          </h1>
          <div className="decorative-line" />
        </div>
      </section>
      <section className="section-padding">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="prose prose-invert max-w-none">
            {article.content.split("\n").map((p, i) =>
              p.trim() ? (
                <p key={i} className="text-[#c0c8d0] leading-relaxed mb-4">{p}</p>
              ) : null
            )}
          </div>
          {article.source && (
            <div className="mt-8 pt-6 border-t border-[#1e3a51]/30">
              <a
                href={article.source}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-[#c9a962]/10 text-[#c9a962] border border-[#c9a962]/30 rounded-lg px-5 py-3 hover:bg-[#c9a962]/20 transition-colors"
              >
                <ExternalLink className="w-4 h-4" />
                Читать на сайте источника
              </a>
            </div>
          )}
          <PublicAttachments attachments={article.attachments} />
          <div className="mt-8">
            <Link href={backHref} className="inline-flex items-center gap-2 text-[#8b9caa] hover:text-[#c9a962] transition-colors text-sm">
              <ArrowLeft className="w-4 h-4" /> Назад к публикациям
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
