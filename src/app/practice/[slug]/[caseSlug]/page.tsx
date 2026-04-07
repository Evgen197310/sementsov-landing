import { prisma } from "@/lib/db";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { PublicAttachments } from "@/components/PublicAttachments";

export const revalidate = 3600;

export async function generateMetadata({ params }: { params: Promise<{ slug: string; caseSlug: string }> }) {
  const { caseSlug } = await params;
  const c = await prisma.practiceCase.findUnique({ where: { slug: caseSlug } });
  if (!c) return { title: "Дело не найдено" };
  return { title: `${c.title} — МКА «Семенцов и Партнёры»` };
}

export default async function PracticeCasePage({ params }: { params: Promise<{ slug: string; caseSlug: string }> }) {
  const { slug, caseSlug } = await params;

  const cat = await prisma.practiceCategory.findUnique({ where: { slug } });
  const practiceCase = await prisma.practiceCase.findUnique({ where: { slug: caseSlug } });
  if (!practiceCase) notFound();

  return (
    <>
      <section className="bg-gradient-to-b from-[#071420] to-[#0b1c2b] py-16 md:py-24">
        <div className="container mx-auto px-4 max-w-5xl">
          <Link
            href={cat ? `/practice/${cat.slug}` : "/practice"}
            className="inline-flex items-center gap-2 text-[#8b9caa] hover:text-[#c9a962] transition-colors text-sm mb-8"
          >
            <ArrowLeft className="w-4 h-4" /> {cat ? cat.name : "Практика"}
          </Link>
          <h1 className="text-2xl md:text-4xl font-['Playfair_Display'] font-bold text-[#f5f3f0] mb-4">
            {practiceCase.title}
          </h1>
          <div className="decorative-line mb-4" />
          {practiceCase.excerpt && <p className="text-[#8b9caa] max-w-2xl">{practiceCase.excerpt}</p>}
        </div>
      </section>
      <section className="section-padding">
        <div className="container mx-auto px-4 max-w-5xl">
          {practiceCase.content && (
            <div
              className="prose prose-invert max-w-none text-[#c5cdd5] leading-relaxed [&_img]:rounded-lg [&_img]:my-4 [&_img]:max-w-full [&_img]:h-auto [&_p]:whitespace-pre-line"
              dangerouslySetInnerHTML={{ __html: practiceCase.content }}
            />
          )}
          {practiceCase.tags && (
            <div className="flex flex-wrap gap-2 mt-8">
              {practiceCase.tags.split(",").map((tag) => (
                <span key={tag} className="text-xs bg-[#1e3a51]/50 text-[#8b9caa] px-3 py-1 rounded-full">
                  {tag.trim()}
                </span>
              ))}
            </div>
          )}
          <PublicAttachments attachments={practiceCase.attachments} />
        </div>
      </section>
    </>
  );
}
