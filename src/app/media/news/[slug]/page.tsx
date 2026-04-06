import { prisma } from "@/lib/db";
import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, FileText, Download } from "lucide-react";
import { PublicAttachments } from "@/components/PublicAttachments";

export const revalidate = 3600;

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const article = await prisma.newsArticle.findUnique({ where: { slug } });
  if (!article) return { title: "Новость не найдена" };
  return { title: `${article.title} — МКА «Семенцов и Партнёры»`, description: article.excerpt };
}

export default async function NewsArticlePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const article = await prisma.newsArticle.findUnique({ where: { slug } });
  if (!article) notFound();

  const attachments = article.attachments ? JSON.parse(article.attachments) : [];

  return (
    <>
      <section className="bg-gradient-to-b from-[#071420] to-[#0b1c2b] py-16 md:py-24">
        <div className="container mx-auto px-4 max-w-4xl">
          <Link href="/media/news" className="inline-flex items-center gap-2 text-[#8b9caa] hover:text-[#c9a962] transition-colors text-sm mb-8">
            <ArrowLeft className="w-4 h-4" /> Назад к новостям
          </Link>
          <div className="text-[#5a6f80] text-sm mb-3">
            {article.createdAt.toLocaleDateString("ru-RU", { year: "numeric", month: "long", day: "numeric" })}
          </div>
          <h1 className="text-3xl md:text-4xl font-['Playfair_Display'] font-bold text-[#f5f3f0] mb-4">
            {article.title}
          </h1>
          <div className="decorative-line" />
        </div>
      </section>

      <section className="section-padding">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="relative">
            {/* Миниатюры изображений справа от текста */}
            {attachments.filter((a: { type: string }) => a.type === "image").length > 0 && (
              <div className="float-right ml-6 mb-4 space-y-4 max-w-[200px] md:max-w-[250px]">
                {attachments
                  .filter((att: { type: string }) => att.type === "image")
                  .map((att: { type: string; url: string; title: string; width?: number; height?: number }, i: number) => {
                    const maxW = att.width ? Math.min(att.width, 250) : 250;
                    return (
                      <figure key={i} className="rounded-lg overflow-hidden border border-[#1e3a51]/30 bg-[#0b1c2b]">
                        <a href={att.url} target="_blank" rel="noopener noreferrer">
                          <img
                            src={att.url}
                            alt={att.title}
                            width={att.width}
                            height={att.height}
                            className="h-auto"
                            style={{ maxWidth: `${maxW}px`, width: '100%' }}
                            loading="lazy"
                          />
                        </a>
                        {att.title && (
                          <figcaption className="text-[#5a6f80] text-xs px-2 py-1.5 text-center">
                            {att.title}
                          </figcaption>
                        )}
                      </figure>
                    );
                  })}
              </div>
            )}

            <div className="text-[#8b9caa] leading-relaxed whitespace-pre-line mb-8">
              {article.content}
            </div>
          </div>

          {/* PDF-вложения */}
          {attachments.filter((a: { type: string }) => a.type === "pdf").length > 0 && (
            <div className="mt-12">
              <h2 className="text-xl font-['Playfair_Display'] font-semibold text-[#f5f3f0] mb-4">Вложения</h2>
              <div className="space-y-3">
                {attachments
                  .filter((att: { type: string }) => att.type === "pdf")
                  .map((att: { type: string; url: string; title: string }, i: number) => (
                    <a
                      key={i}
                      href={att.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-3 bg-[#0f2133] border border-[#1e3a51]/30 rounded-lg p-4 hover:border-[#c9a962]/30 transition-all"
                    >
                      <FileText className="w-5 h-5 text-[#c9a962] flex-shrink-0" />
                      <span className="text-[#c5cdd5] text-sm flex-1">{att.title}</span>
                      <span className="text-[#5a6f80] text-xs uppercase">PDF</span>
                    </a>
                  ))}
              </div>
            </div>
          )}

          <PublicAttachments attachments={article.attachments} />

          <div className="mt-12">
            <Link href="/media/news" className="btn-outline inline-flex items-center gap-2">
              <ArrowLeft className="w-4 h-4" /> Все новости
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
