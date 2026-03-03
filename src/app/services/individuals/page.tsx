import Link from "next/link";
import { prisma } from "@/lib/db";
import { ArrowRight } from "lucide-react";

export const revalidate = 3600;
export const metadata = { title: "Услуги физическим лицам — МКА «Семенцов и Партнёры»" };

export default async function IndividualsPage() {
  const services = await prisma.service.findMany({
    where: { category: { slug: "individuals" } },
    orderBy: { order: "asc" },
  });

  return (
    <>
      <section className="bg-gradient-to-b from-[#071420] to-[#0b1c2b] py-16 md:py-24">
        <div className="container mx-auto px-4 max-w-6xl">
          <h1 className="text-3xl md:text-5xl font-['Playfair_Display'] font-bold text-[#f5f3f0] mb-4">
            Услуги физическим лицам
          </h1>
          <div className="decorative-line mb-6" />
          <p className="text-[#8b9caa] max-w-2xl">
            Специалисты МКА «Семенцов и Партнёры» проконсультируют Вас по различным вопросам.
            Для записи на консультацию — +7 (495) 629 82 50.
          </p>
        </div>
      </section>
      <section className="section-padding">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.map((s) => (
              <Link
                key={s.id}
                href={`/services/individuals/${s.slug}`}
                className="bg-[#0f2133] border border-[#1e3a51]/30 rounded-xl p-6 hover:border-[#c9a962]/30 transition-all card-enhanced group"
              >
                <h2 className="text-[#f5f3f0] font-semibold group-hover:text-[#c9a962] transition-colors mb-2">
                  {s.title}
                </h2>
                {s.description && (
                  <p className="text-[#8b9caa] text-sm line-clamp-3">{s.description}</p>
                )}
                <span className="inline-flex items-center gap-1 text-[#c9a962] text-sm mt-4">
                  Подробнее <ArrowRight className="w-3.5 h-3.5" />
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
