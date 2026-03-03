import { prisma } from "@/lib/db";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Phone } from "lucide-react";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const service = await prisma.service.findUnique({ where: { slug } });
  if (!service) return { title: "Услуга не найдена" };
  return { title: `${service.title} — МКА «Семенцов и Партнёры»`, description: service.description };
}

export default async function LegalServicePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const service = await prisma.service.findUnique({ where: { slug }, include: { faqs: { orderBy: { order: "asc" } } } });
  if (!service) notFound();

  return (
    <>
      <section className="bg-gradient-to-b from-[#071420] to-[#0b1c2b] py-16 md:py-24">
        <div className="container mx-auto px-4 max-w-4xl">
          <Link href="/services/legal" className="inline-flex items-center gap-2 text-[#8b9caa] hover:text-[#c9a962] transition-colors text-sm mb-8">
            <ArrowLeft className="w-4 h-4" /> Услуги юридическим лицам
          </Link>
          <h1 className="text-3xl md:text-4xl font-['Playfair_Display'] font-bold text-[#f5f3f0] mb-4">
            {service.title}
          </h1>
          <div className="decorative-line" />
        </div>
      </section>
      <section className="section-padding">
        <div className="container mx-auto px-4 max-w-4xl">
          {service.content ? (
            <div className="text-[#8b9caa] leading-relaxed whitespace-pre-line mb-8">{service.content}</div>
          ) : (
            <p className="text-[#8b9caa] mb-8">Для получения подробной информации обратитесь по телефону.</p>
          )}
          {service.faqs.length > 0 && (
            <div className="mt-12">
              <h2 className="text-2xl font-['Playfair_Display'] font-semibold text-[#f5f3f0] mb-6">Частые вопросы</h2>
              <div className="space-y-4">
                {service.faqs.map((faq) => (
                  <div key={faq.id} className="bg-[#0f2133] border border-[#1e3a51]/30 rounded-xl p-5">
                    <h3 className="text-[#f5f3f0] font-medium mb-2">{faq.question}</h3>
                    <p className="text-[#8b9caa] text-sm">{faq.answer}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
          <div className="mt-12 bg-[#0f2133] border border-[#c9a962]/20 rounded-xl p-6 text-center">
            <p className="text-[#f5f3f0] font-medium mb-2">Нужна консультация?</p>
            <p className="text-[#8b9caa] text-sm mb-4">Позвоните нам или оставьте заявку</p>
            <a href="tel:+74956298250" className="btn-primary inline-flex items-center gap-2">
              <Phone className="w-4 h-4" /> +7 (495) 629 82 50
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
