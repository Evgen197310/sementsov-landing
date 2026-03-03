import Link from "next/link";
import { prisma } from "@/lib/db";
import { ArrowRight, Scale, Globe, Shield, Award, Users, Clock } from "lucide-react";

export const revalidate = 3600;
export const metadata = { title: "О коллегии — МКА «Семенцов и Партнёры»" };

export default async function AboutPage() {
  const page = await prisma.page.findUnique({ where: { slug: "about" } });
  const teamCount = await prisma.teamMember.count();

  return (
    <>
      <section className="bg-gradient-to-b from-[#071420] to-[#0b1c2b] py-16 md:py-24">
        <div className="container mx-auto px-4 max-w-5xl">
          <h1 className="text-3xl md:text-5xl font-['Playfair_Display'] font-bold text-[#f5f3f0] mb-4">
            О коллегии
          </h1>
          <div className="decorative-line mb-8" />
          <div className="text-[#8b9caa] leading-relaxed space-y-4 max-w-3xl whitespace-pre-line">
            {page?.content}
          </div>
        </div>
      </section>

      <section className="section-padding">
        <div className="container mx-auto px-4 max-w-5xl">
          <h2 className="text-2xl md:text-3xl font-['Playfair_Display'] font-semibold text-[#f5f3f0] mb-8 text-center">
            Ключевые цифры
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { icon: Clock, val: "1997", label: "год основания" },
              { icon: Users, val: String(teamCount), label: "адвокатов" },
              { icon: Globe, val: "ЕСПЧ", label: "международная практика" },
              { icon: Award, val: "25+", label: "лет опыта" },
            ].map((s, i) => (
              <div key={i} className="bg-[#0f2133] border border-[#1e3a51]/30 rounded-xl p-6 text-center">
                <s.icon className="w-7 h-7 text-[#c9a962] mx-auto mb-3" />
                <div className="text-2xl font-['Playfair_Display'] font-bold text-[#f5f3f0]">{s.val}</div>
                <div className="text-xs text-[#8b9caa] mt-1">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section-padding bg-[#071420]">
        <div className="container mx-auto px-4 max-w-5xl">
          <h2 className="text-2xl md:text-3xl font-['Playfair_Display'] font-semibold text-[#f5f3f0] mb-8 text-center">
            Направления работы
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { icon: Shield, title: "Уголовное право", desc: "Защита на всех стадиях — от дознания до Верховного суда" },
              { icon: Scale, title: "Гражданское и арбитражное", desc: "Представительство в судах всех инстанций" },
              { icon: Globe, title: "Международная практика", desc: "ЕСПЧ, партнёрства с юристами Европы и Америки" },
            ].map((item, i) => (
              <div key={i} className="bg-[#0b1c2b] border border-[#1e3a51]/30 rounded-xl p-6">
                <item.icon className="w-8 h-8 text-[#c9a962] mb-4" />
                <h3 className="text-[#f5f3f0] font-semibold mb-2">{item.title}</h3>
                <p className="text-[#8b9caa] text-sm">{item.desc}</p>
              </div>
            ))}
          </div>
          <div className="text-center mt-10">
            <Link href="/team" className="btn-primary inline-flex items-center gap-2">
              Наша команда <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
