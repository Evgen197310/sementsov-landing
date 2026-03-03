import { prisma } from "@/lib/db";
import { Mail } from "lucide-react";

export const metadata = { title: "Карьера — МКА «Семенцов и Партнёры»" };

export default async function CareerPage() {
  const page = await prisma.page.findUnique({ where: { slug: "career" } });

  return (
    <>
      <section className="bg-gradient-to-b from-[#071420] to-[#0b1c2b] py-16 md:py-24">
        <div className="container mx-auto px-4 max-w-4xl">
          <h1 className="text-3xl md:text-5xl font-['Playfair_Display'] font-bold text-[#f5f3f0] mb-4">
            Карьера
          </h1>
          <div className="decorative-line" />
        </div>
      </section>
      <section className="section-padding">
        <div className="container mx-auto px-4 max-w-4xl">
          {page?.content && (
            <div className="text-[#8b9caa] leading-relaxed whitespace-pre-line mb-8">{page.content}</div>
          )}
          <div className="bg-[#0f2133] border border-[#c9a962]/20 rounded-xl p-8 text-center">
            <Mail className="w-8 h-8 text-[#c9a962] mx-auto mb-4" />
            <p className="text-[#f5f3f0] font-medium text-lg mb-2">Направляйте резюме</p>
            <a href="mailto:vsementsov11@mail.ru" className="text-[#c9a962] hover:text-[#ddc488] transition-colors text-lg">
              vsementsov11@mail.ru
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
