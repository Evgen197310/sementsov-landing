import { prisma } from "@/lib/db";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, FileText, Download } from "lucide-react";

export const revalidate = 3600;

interface AttachmentItem {
  url: string;
  originalName?: string;
  name?: string;
  size: number;
}

function parseAttachments(raw: string): AttachmentItem[] {
  if (!raw) return [];
  try { return JSON.parse(raw); } catch { return []; }
}

function formatSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} Б`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} КБ`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} МБ`;
}

function getDisplayName(item: AttachmentItem): string {
  return item.originalName || item.name || item.url.split("/").pop() || "file";
}

/** Extract image URLs from HTML content */
function extractImages(html: string): string[] {
  const matches = html.match(/<img[^>]*src="([^"]+)"[^>]*>/g) || [];
  return matches.map((m) => {
    const src = m.match(/src="([^"]+)"/);
    return src ? src[1] : "";
  }).filter(Boolean);
}

/** Extract text content (strip HTML tags) */
function extractText(html: string): string {
  return html.replace(/<[^>]+>/g, "").trim();
}

/** Detect if content has inline images (scans) */
function hasInlineImages(html: string): boolean {
  return (html.match(/<img/g) || []).length > 1;
}

/** Detect if attachments contain a PDF */
function getPdfAttachment(items: AttachmentItem[]): AttachmentItem | null {
  return items.find((i) => getDisplayName(i).toLowerCase().endsWith(".pdf")) || null;
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string; caseSlug: string }> }) {
  const { caseSlug } = await params;
  const c = await prisma.practiceCase.findUnique({ where: { slug: caseSlug } });
  if (!c) return { title: "Дело не найдено" };
  return {
    title: `${c.title} — МКА «Семенцов и Партнёры»`,
    description: c.excerpt || undefined,
  };
}

export default async function PracticeCasePage({ params }: { params: Promise<{ slug: string; caseSlug: string }> }) {
  const { slug, caseSlug } = await params;

  const cat = await prisma.practiceCategory.findUnique({ where: { slug } });
  const practiceCase = await prisma.practiceCase.findUnique({ where: { slug: caseSlug } });
  if (!practiceCase) notFound();

  const attachments = parseAttachments(practiceCase.attachments);
  const pdfAttachment = getPdfAttachment(attachments);
  const contentHtml = practiceCase.content || "";
  const inlineImages = hasInlineImages(contentHtml);
  const images = inlineImages ? extractImages(contentHtml) : [];
  const textContent = inlineImages ? extractText(contentHtml) : "";

  return (
    <>
      {/* Header */}
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
          {practiceCase.excerpt && (
            <p className="text-[#8b9caa] max-w-3xl text-lg leading-relaxed">{practiceCase.excerpt}</p>
          )}
        </div>
      </section>

      <section className="section-padding">
        <div className="container mx-auto px-4 max-w-5xl space-y-10">

          {/* Inline PDF viewer */}
          {pdfAttachment && (
            <div>
              <h2 className="text-lg font-semibold text-[#f5f3f0] mb-4 flex items-center gap-2">
                <FileText className="w-5 h-5 text-[#c9a962]" />
                Судебный акт
              </h2>
              <div className="bg-[#0f2133] border border-[#1e3a51]/30 rounded-xl overflow-hidden">
                <iframe
                  src={pdfAttachment.url}
                  className="w-full h-[70vh] min-h-[500px]"
                  title={getDisplayName(pdfAttachment)}
                />
                <div className="flex items-center justify-between px-4 py-3 border-t border-[#1e3a51]/30">
                  <div className="flex items-center gap-2 text-sm text-[#8b9caa]">
                    <FileText className="w-4 h-4 text-red-400" />
                    <span>{getDisplayName(pdfAttachment)}</span>
                    <span className="text-[#5a6f80]">({formatSize(pdfAttachment.size)})</span>
                  </div>
                  <a
                    href={pdfAttachment.url}
                    download={getDisplayName(pdfAttachment)}
                    className="flex items-center gap-1.5 text-sm text-[#c9a962] hover:text-[#ddc488] transition-colors"
                  >
                    <Download className="w-4 h-4" /> Скачать
                  </a>
                </div>
              </div>
            </div>
          )}

          {/* Image gallery (for scanned documents) */}
          {inlineImages && images.length > 0 && (
            <div>
              <h2 className="text-lg font-semibold text-[#f5f3f0] mb-4">
                Документ ({images.length} {images.length === 1 ? "страница" : images.length < 5 ? "страницы" : "страниц"})
              </h2>
              {textContent && (
                <p className="text-[#c5cdd5] mb-6 leading-relaxed">{textContent}</p>
              )}
              <div className="space-y-4">
                {images.map((src, i) => (
                  <div key={i} className="bg-[#0f2133] border border-[#1e3a51]/30 rounded-xl overflow-hidden">
                    <div className="px-4 py-2 border-b border-[#1e3a51]/20 flex items-center justify-between">
                      <span className="text-xs text-[#5a6f80]">Страница {i + 1} из {images.length}</span>
                    </div>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={src}
                      alt={`${practiceCase.title} — страница ${i + 1}`}
                      className="w-full h-auto"
                    />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Regular content (non-image HTML or plain text) */}
          {!inlineImages && contentHtml && (
            <div
              className="prose prose-invert max-w-none text-[#c5cdd5] leading-relaxed [&_img]:rounded-lg [&_img]:my-4 [&_img]:max-w-full [&_img]:h-auto [&_p]:whitespace-pre-line"
              dangerouslySetInnerHTML={{ __html: contentHtml }}
            />
          )}

          {/* Non-PDF attachments */}
          {attachments.filter((a) => !getDisplayName(a).toLowerCase().endsWith(".pdf")).length > 0 && (
            <div>
              <h2 className="text-lg font-semibold text-[#f5f3f0] mb-4 flex items-center gap-2">
                <Download className="w-5 h-5 text-[#c9a962]" />
                Прикреплённые файлы
              </h2>
              <div className="space-y-2">
                {attachments
                  .filter((a) => !getDisplayName(a).toLowerCase().endsWith(".pdf"))
                  .map((item, i) => {
                    const name = getDisplayName(item);
                    const isImage = /\.(jpg|jpeg|png)$/i.test(name);
                    return (
                      <a
                        key={i}
                        href={item.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        download={name}
                        className="flex items-center gap-3 bg-[#0f2133] border border-[#1e3a51]/30 rounded-lg px-4 py-3 hover:border-[#c9a962]/30 transition-colors group"
                      >
                        {isImage ? (
                          /* eslint-disable-next-line @next/next/no-img-element */
                          <img src={item.url} alt={name} className="w-12 h-12 object-cover rounded" />
                        ) : (
                          <FileText className="w-5 h-5 text-[#c9a962]" />
                        )}
                        <div className="flex-1 min-w-0">
                          <div className="text-[#f5f3f0] text-sm truncate group-hover:text-[#c9a962] transition-colors">{name}</div>
                          <div className="text-[#5a6f80] text-xs">{formatSize(item.size)}</div>
                        </div>
                        <Download className="w-4 h-4 text-[#5a6f80] group-hover:text-[#c9a962] transition-colors flex-shrink-0" />
                      </a>
                    );
                  })}
              </div>
            </div>
          )}

          {/* Tags */}
          {practiceCase.tags && (
            <div className="flex flex-wrap gap-2">
              {practiceCase.tags.split(",").map((tag) => (
                <span key={tag} className="text-xs bg-[#1e3a51]/50 text-[#8b9caa] px-3 py-1 rounded-full">
                  {tag.trim()}
                </span>
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  );
}
