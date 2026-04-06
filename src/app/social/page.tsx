import { prisma } from "@/lib/db";
import { ExternalLink } from "lucide-react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export const metadata = { title: "Мы в соцсетях — МКА «Семенцов и Партнёры»" };

export default async function SocialPage() {
  const links = await prisma.socialLink.findMany({ orderBy: { order: "asc" } });

  return (
    <>
      <section className="bg-gradient-to-b from-[#071420] to-[#0b1c2b] py-16 md:py-24">
        <div className="container mx-auto px-4 max-w-5xl">
          <Link href="/" className="inline-flex items-center gap-2 text-[#8b9caa] hover:text-[#c9a962] transition-colors text-sm mb-8">
            <ArrowLeft className="w-4 h-4" /> На главную
          </Link>
          <h1 className="text-3xl md:text-5xl font-['Playfair_Display'] font-bold text-[#f5f3f0] mb-4">
            Мы в соцсетях
          </h1>
          <div className="decorative-line mb-6" />
          <p className="text-[#8b9caa] max-w-2xl">
            Следите за новостями и публикациями МКА «Семенцов и Партнёры» в социальных сетях
          </p>
        </div>
      </section>
      <section className="section-padding">
        <div className="container mx-auto px-4 max-w-5xl">
          {links.length === 0 ? (
            <p className="text-[#8b9caa]">Ссылки на соцсети пока не добавлены.</p>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {links.map((s) => (
                <a
                  key={s.id}
                  href={s.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-[#0f2133] border border-[#1e3a51]/30 rounded-xl p-6 flex items-center gap-4 hover:border-[#c9a962]/30 hover:bg-[#0f2133]/80 transition-all group"
                >
                  <div className="w-12 h-12 rounded-full bg-[#c9a962]/10 flex items-center justify-center flex-shrink-0">
                    <ExternalLink className="w-5 h-5 text-[#c9a962]" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h2 className="text-[#f5f3f0] font-semibold group-hover:text-[#c9a962] transition-colors">
                      {s.platform}
                    </h2>
                    <p className="text-[#5a6f80] text-xs truncate mt-0.5">{s.url}</p>
                  </div>
                </a>
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  );
}
