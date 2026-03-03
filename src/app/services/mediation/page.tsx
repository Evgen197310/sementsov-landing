import { prisma } from "@/lib/db";
import { Phone, Handshake } from "lucide-react";

export const metadata = { title: "Медиация — МКА «Семенцов и Партнёры»" };

export default async function MediationPage() {
  const page = await prisma.page.findUnique({ where: { slug: "mediation" } });

  return (
    <>
      <section className="bg-gradient-to-b from-[#071420] to-[#0b1c2b] py-16 md:py-24">
        <div className="container mx-auto px-4 max-w-4xl">
          <Handshake className="w-10 h-10 text-[#c9a962] mb-4" />
          <h1 className="text-3xl md:text-5xl font-['Playfair_Display'] font-bold text-[#f5f3f0] mb-4">
            Медиация
          </h1>
          <div className="decorative-line" />
        </div>
      </section>
      <section className="section-padding">
        <div className="container mx-auto px-4 max-w-4xl">
          {page?.content && (
            <div className="text-[#8b9caa] leading-relaxed whitespace-pre-line mb-8">{page.content}</div>
          )}
          <div className="mt-8 bg-[#0f2133] border border-[#c9a962]/20 rounded-xl p-6 text-center">
            <p className="text-[#f5f3f0] font-medium mb-2">Консультация по медиации</p>
            <p className="text-[#8b9caa] text-sm mb-4">г. Москва, ул. Б. Дмитровка, д. 20, стр. 2, оф. 20</p>
            <a href="tel:+74956298250" className="btn-primary inline-flex items-center gap-2">
              <Phone className="w-4 h-4" /> +7 (495) 629 82 50
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
