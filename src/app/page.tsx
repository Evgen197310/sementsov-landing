import Link from "next/link";
import Image from "next/image";
import { prisma } from "@/lib/db";
import {
  Scale,
  Shield,
  Landmark,
  Users,
  ArrowRight,
  Phone,
  Award,
  Globe,
  Clock,
} from "lucide-react";
import { AnimateOnScroll } from "@/components/AnimateOnScroll";
import { CountUp } from "@/components/CountUp";

export const revalidate = 3600;

export default async function HomePage() {
  const [team, news, servicesInd, servicesLegal] = await Promise.all([
    prisma.teamMember.findMany({ orderBy: { order: "asc" }, take: 4 }),
    prisma.mediaArticle.findMany({ orderBy: { createdAt: "desc" }, take: 3 }),
    prisma.service.findMany({
      where: { category: { slug: "individuals" } },
      orderBy: { order: "asc" },
      take: 4,
    }),
    prisma.service.findMany({
      where: { category: { slug: "legal" } },
      orderBy: { order: "asc" },
      take: 4,
    }),
  ]);

  return (
    <>
      {/* Hero */}
      <section className="relative min-h-[85vh] overflow-hidden" style={{ background: "linear-gradient(135deg, #071420 0%, #0b1c2b 50%, #132d44 100%)" }}>
        <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23c9a962' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E\")" }} />

        <div className="relative container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center min-h-[85vh] py-16 md:py-24">
            {/* Text Content */}
            <div>
              {/* Mobile photo — compact circular */}
              <div className="lg:hidden mb-6 flex items-center gap-4">
                <div className="relative w-20 h-20 sm:w-24 sm:h-24 flex-shrink-0">
                  <Image
                    src="/team/sementsov.webp"
                    alt="Семенцов Владимир Алексеевич"
                    width={96}
                    height={96}
                    className="w-full h-full object-cover object-top rounded-full border-2 border-[#c9a962]/50"
                    priority
                  />
                </div>
                <div>
                  <div className="text-base sm:text-lg font-['Playfair_Display'] font-semibold text-[#f5f3f0]">
                    Владимир Семенцов
                  </div>
                  <div className="text-xs sm:text-sm text-[#c9a962]">
                    Председатель Президиума
                  </div>
                </div>
              </div>

              <div className="inline-flex items-center gap-2 bg-[#c9a962]/10 border border-[#c9a962]/20 rounded-full px-4 py-1.5 mb-8">
                <span className="w-2 h-2 bg-[#c9a962] rounded-full animate-pulse" />
                <span className="text-[#c9a962] text-xs font-medium tracking-wider uppercase">
                  Работаем с 1997 года
                </span>
              </div>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-['Playfair_Display'] font-bold text-[#f5f3f0] leading-tight mb-6">
                Московская коллегия адвокатов{" "}
                <span className="text-[#c9a962]">«Семенцов и&nbsp;Партнёры»</span>
              </h1>
              <p className="text-base sm:text-lg lg:text-xl text-[#8b9caa] mb-10 max-w-xl leading-relaxed">
                Защищаем интересы граждан и бизнеса в судах всех инстанций —
                от районного суда до Верховного суда РФ и Европейского суда по правам человека
              </p>
              <div className="flex flex-wrap gap-4">
                <Link href="/contacts" className="btn-primary inline-flex items-center gap-2">
                  Записаться на консультацию
                  <ArrowRight className="w-4 h-4" />
                </Link>
                <Link href="/about" className="btn-outline inline-flex items-center gap-2">
                  О коллегии
                </Link>
              </div>
            </div>

            {/* Photo — desktop, clean without gradients */}
            <div className="relative hidden lg:block">
              <div className="relative w-full max-w-md mx-auto">
                <div className="relative overflow-hidden rounded-sm">
                  <Image
                    src="/team/sementsov.webp"
                    alt="Семенцов Владимир Алексеевич"
                    width={400}
                    height={500}
                    className="w-full h-auto object-cover"
                    priority
                  />
                  {/* Credentials badge */}
                  <div className="absolute bottom-0 left-0 right-0 bg-[#0b1c2b]/80 backdrop-blur-sm p-4 border-t border-[#1e3a51]/50">
                    <p className="text-lg font-['Playfair_Display'] font-semibold text-[#f5f3f0]">
                      Владимир Семенцов
                    </p>
                    <p className="text-sm text-[#c9a962]">Председатель Президиума</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="relative -mt-16 z-20 pb-8">
        <div className="container mx-auto px-4">
          <AnimateOnScroll animation="fade-up" className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-5xl mx-auto aos-stagger">
            {[
              { icon: Clock, num: 25, suffix: "+", label: "лет опыта" },
              { icon: Award, num: 500, suffix: "+", label: "успешных дел" },
              { icon: Globe, text: "ЕСПЧ", label: "международная практика" },
              { icon: Users, num: 11, suffix: "", label: "адвокатов" },
            ].map((stat, i) => (
              <div
                key={i}
                className="bg-[#0f2133] border border-[#1e3a51]/40 rounded-xl p-5 text-center card-enhanced"
              >
                <stat.icon className="w-6 h-6 text-[#c9a962] mx-auto mb-2" />
                <div className="text-2xl md:text-3xl font-['Playfair_Display'] font-bold text-[#f5f3f0]">
                  {stat.num != null ? (
                    <CountUp end={stat.num} suffix={stat.suffix} />
                  ) : (
                    stat.text
                  )}
                </div>
                <div className="text-xs text-[#8b9caa] mt-1">{stat.label}</div>
              </div>
            ))}
          </AnimateOnScroll>
        </div>
      </section>

      {/* About preview */}
      <section className="section-padding">
        <div className="container mx-auto max-w-5xl">
          <AnimateOnScroll animation="fade-up" className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-['Playfair_Display'] font-semibold text-[#f5f3f0] mb-4">
              О коллегии
            </h2>
            <div className="decorative-line mx-auto mb-6" />
            <p className="text-[#8b9caa] max-w-3xl mx-auto leading-relaxed">
              Московская коллегия адвокатов «Семенцов и Партнёры» — юридическая компания,
              работающая в России с 1997 года. За это время нашими клиентами стали десятки
              крупных компаний, государственные учреждения, предприниматели и физические лица.
            </p>
            <p className="text-[#8b9caa] max-w-3xl mx-auto leading-relaxed mt-4">
              Наша коллегия находится в партнёрских отношениях с адвокатскими образованиями
              Европы и Америки, поэтому мы оказываем юридическую поддержку не только в России,
              но и за рубежом.
            </p>
            <Link href="/about" className="inline-flex items-center gap-2 text-[#c9a962] hover:text-[#ddc488] transition-colors mt-6 text-sm font-medium">
              Подробнее о коллегии <ArrowRight className="w-4 h-4" />
            </Link>
          </AnimateOnScroll>
        </div>
      </section>

      {/* Services */}
      <section className="section-padding bg-[#071420]">
        <div className="container mx-auto max-w-6xl">
          <AnimateOnScroll animation="fade-up" className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-['Playfair_Display'] font-semibold text-[#f5f3f0] mb-4">
              Наша экспертиза
            </h2>
            <div className="decorative-line mx-auto" />
          </AnimateOnScroll>

          <AnimateOnScroll animation="fade-up" delay={100} className="grid md:grid-cols-2 gap-8 mb-8">
            {/* Individuals */}
            <div>
              <div className="flex items-center gap-3 mb-6">
                <Shield className="w-6 h-6 text-[#c9a962]" />
                <h3 className="text-xl font-['Playfair_Display'] font-semibold text-[#f5f3f0]">
                  Физическим лицам
                </h3>
              </div>
              <div className="space-y-3">
                {servicesInd.map((s) => (
                  <Link
                    key={s.id}
                    href={`/services/individuals/${s.slug}`}
                    className="block p-4 bg-[#0b1c2b] border border-[#1e3a51]/30 rounded-lg hover:border-[#c9a962]/30 transition-all group"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-[#c5cdd5] group-hover:text-[#f5f3f0] transition-colors text-sm font-medium">
                        {s.title}
                      </span>
                      <ArrowRight className="w-4 h-4 text-[#3d4f5f] group-hover:text-[#c9a962] transition-colors" />
                    </div>
                    {s.description && (
                      <p className="text-[#5a6f80] text-xs mt-1 line-clamp-1">{s.description}</p>
                    )}
                  </Link>
                ))}
              </div>
              <Link href="/services/individuals" className="inline-flex items-center gap-2 text-[#c9a962] hover:text-[#ddc488] transition-colors mt-4 text-sm font-medium">
                Все услуги физ. лицам <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            {/* Legal */}
            <div>
              <div className="flex items-center gap-3 mb-6">
                <Scale className="w-6 h-6 text-[#c9a962]" />
                <h3 className="text-xl font-['Playfair_Display'] font-semibold text-[#f5f3f0]">
                  Юридическим лицам
                </h3>
              </div>
              <div className="space-y-3">
                {servicesLegal.map((s) => (
                  <Link
                    key={s.id}
                    href={`/services/legal/${s.slug}`}
                    className="block p-4 bg-[#0b1c2b] border border-[#1e3a51]/30 rounded-lg hover:border-[#c9a962]/30 transition-all group"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-[#c5cdd5] group-hover:text-[#f5f3f0] transition-colors text-sm font-medium">
                        {s.title}
                      </span>
                      <ArrowRight className="w-4 h-4 text-[#3d4f5f] group-hover:text-[#c9a962] transition-colors" />
                    </div>
                    {s.description && (
                      <p className="text-[#5a6f80] text-xs mt-1 line-clamp-1">{s.description}</p>
                    )}
                  </Link>
                ))}
              </div>
              <Link href="/services/legal" className="inline-flex items-center gap-2 text-[#c9a962] hover:text-[#ddc488] transition-colors mt-4 text-sm font-medium">
                Все услуги юр. лицам <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </AnimateOnScroll>
        </div>
      </section>

      {/* Team */}
      <section className="section-padding">
        <div className="container mx-auto max-w-6xl">
          <AnimateOnScroll animation="fade-up" className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-['Playfair_Display'] font-semibold text-[#f5f3f0] mb-4">
              Наша команда
            </h2>
            <div className="decorative-line mx-auto mb-4" />
            <p className="text-[#8b9caa] max-w-2xl mx-auto">
              Опытные адвокаты с многолетним стажем в органах прокуратуры, следствия и суда
            </p>
          </AnimateOnScroll>
          <AnimateOnScroll animation="fade-up" delay={100} className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 aos-stagger">
            {team.map((member) => (
              <Link
                key={member.id}
                href={`/team/${member.slug}`}
                className="bg-[#0f2133] border border-[#1e3a51]/30 rounded-xl p-6 hover:border-[#c9a962]/30 transition-all card-enhanced group"
              >
                {member.photo ? (
                  <div className="w-16 h-16 rounded-full overflow-hidden mb-4">
                    <Image src={member.photo} alt={member.name} width={64} height={64} sizes="64px" className="w-full h-full object-cover" />
                  </div>
                ) : (
                  <div className="w-16 h-16 bg-[#1e3a51] rounded-full flex items-center justify-center mb-4">
                    <span className="text-[#c9a962] text-xl font-['Playfair_Display'] font-semibold">
                      {member.name.split(" ").map((w) => w[0]).join("").slice(0, 2)}
                    </span>
                  </div>
                )}
                <h3 className="text-[#f5f3f0] font-medium text-sm group-hover:text-[#c9a962] transition-colors">
                  {member.name}
                </h3>
                <p className="text-[#c9a962] text-xs mt-1">{member.position}</p>
                {member.specialization && (
                  <p className="text-[#5a6f80] text-xs mt-2 line-clamp-2">{member.specialization}</p>
                )}
              </Link>
            ))}
          </AnimateOnScroll>
          <div className="text-center mt-8">
            <Link href="/team" className="inline-flex items-center gap-2 text-[#c9a962] hover:text-[#ddc488] transition-colors text-sm font-medium">
              Вся команда <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* News */}
      {news.length > 0 && (
        <section className="section-padding bg-[#071420]">
          <div className="container mx-auto max-w-6xl">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-3xl md:text-4xl font-['Playfair_Display'] font-semibold text-[#f5f3f0] mb-2">
                  Последние публикации
                </h2>
                <div className="decorative-line" />
              </div>
              <Link href="/media/press" className="hidden md:inline-flex items-center gap-2 text-[#c9a962] hover:text-[#ddc488] transition-colors text-sm font-medium">
                Все публикации <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
            <AnimateOnScroll animation="fade-up" delay={100} className="grid md:grid-cols-3 gap-6 aos-stagger">
              {news.map((article) => (
                <Link
                  key={article.id}
                  href={`/media/press/article/${article.slug}`}
                  className="bg-[#0b1c2b] border border-[#1e3a51]/30 rounded-xl p-6 hover:border-[#c9a962]/30 transition-all card-enhanced group"
                >
                  <div className="text-[#5a6f80] text-xs mb-3">
                    {article.createdAt.toLocaleDateString("ru-RU")}
                  </div>
                  <h3 className="text-[#f5f3f0] font-medium text-sm leading-relaxed group-hover:text-[#c9a962] transition-colors line-clamp-3">
                    {article.title}
                  </h3>
                  {article.excerpt && (
                    <p className="text-[#5a6f80] text-xs mt-3 line-clamp-2">{article.excerpt}</p>
                  )}
                </Link>
              ))}
            </AnimateOnScroll>
          </div>
        </section>
      )}

      {/* CTA */}
      <section className="section-padding">
        <AnimateOnScroll animation="fade-up" className="container mx-auto max-w-4xl text-center">
          <Landmark className="w-10 h-10 text-[#c9a962] mx-auto mb-6" />
          <h2 className="text-3xl md:text-4xl font-['Playfair_Display'] font-semibold text-[#f5f3f0] mb-4">
            Нужна юридическая помощь?
          </h2>
          <p className="text-[#8b9caa] mb-8 max-w-xl mx-auto">
            Запишитесь на консультацию — наши адвокаты проанализируют вашу ситуацию
            и предложат оптимальное решение
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <a href="tel:+74956298250" className="btn-primary inline-flex items-center gap-2">
              <Phone className="w-4 h-4" />
              +7 (495) 629 82 50
            </a>
            <Link href="/contacts" className="btn-outline">
              Оставить заявку
            </Link>
          </div>
        </AnimateOnScroll>
      </section>
    </>
  );
}
