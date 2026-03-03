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

export default async function HomePage() {
  const team = await prisma.teamMember.findMany({ orderBy: { order: "asc" }, take: 4 });
  const news = await prisma.mediaArticle.findMany({ orderBy: { createdAt: "desc" }, take: 3 });
  const servicesInd = await prisma.service.findMany({
    where: { category: { slug: "individuals" } },
    orderBy: { order: "asc" },
    take: 4,
  });
  const servicesLegal = await prisma.service.findMany({
    where: { category: { slug: "legal" } },
    orderBy: { order: "asc" },
    take: 4,
  });

  return (
    <>
      {/* Hero */}
      <section className="relative min-h-[85vh] flex items-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-[#071420] via-[#0b1c2b] to-[#132d44]" />
        <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23c9a962' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E\")" }} />
        <div className="container mx-auto px-4 relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-flex items-center gap-2 bg-[#c9a962]/10 border border-[#c9a962]/20 rounded-full px-4 py-1.5 mb-8">
                <span className="w-2 h-2 bg-[#c9a962] rounded-full animate-pulse" />
                <span className="text-[#c9a962] text-xs font-medium tracking-wider uppercase">
                  Работаем с 1997 года
                </span>
              </div>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-['Playfair_Display'] font-bold text-[#f5f3f0] leading-tight mb-6">
                Московская коллегия адвокатов{" "}
                <span className="text-[#c9a962]">«Семенцов и&nbsp;Партнёры»</span>
              </h1>
              <p className="text-lg sm:text-xl text-[#8b9caa] mb-10 max-w-2xl leading-relaxed">
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
            <div className="hidden lg:block">
              <div className="relative">
                <div className="absolute inset-0 bg-[#c9a962]/10 rounded-3xl blur-3xl" />
                <div className="relative rounded-3xl overflow-hidden border-2 border-[#c9a962]/20">
                  <Image
                    src="/team/sementsov.webp"
                    alt="Семенцов Владимир Алексеевич"
                    width={500}
                    height={600}
                    className="w-full h-auto"
                    priority
                  />
                </div>
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-[#0b1c2b] via-[#0b1c2b]/80 to-transparent p-6">
                  <p className="text-[#f5f3f0] font-['Playfair_Display'] font-semibold text-lg">Владимир Семенцов</p>
                  <p className="text-[#c9a962] text-sm">Председатель Президиума</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="relative -mt-16 z-20 pb-8">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-5xl mx-auto">
            {[
              { icon: Clock, value: "25+", label: "лет опыта" },
              { icon: Award, value: "500+", label: "успешных дел" },
              { icon: Globe, value: "ЕСПЧ", label: "международная практика" },
              { icon: Users, value: "11", label: "адвокатов" },
            ].map((stat, i) => (
              <div
                key={i}
                className="bg-[#0f2133] border border-[#1e3a51]/40 rounded-xl p-5 text-center card-enhanced"
              >
                <stat.icon className="w-6 h-6 text-[#c9a962] mx-auto mb-2" />
                <div className="text-2xl md:text-3xl font-['Playfair_Display'] font-bold text-[#f5f3f0]">
                  {stat.value}
                </div>
                <div className="text-xs text-[#8b9caa] mt-1">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* About preview */}
      <section className="section-padding">
        <div className="container mx-auto max-w-5xl">
          <div className="text-center mb-12">
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
          </div>
        </div>
      </section>

      {/* Services */}
      <section className="section-padding bg-[#071420]">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-['Playfair_Display'] font-semibold text-[#f5f3f0] mb-4">
              Наша экспертиза
            </h2>
            <div className="decorative-line mx-auto" />
          </div>

          <div className="grid md:grid-cols-2 gap-8 mb-8">
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
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="section-padding">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-['Playfair_Display'] font-semibold text-[#f5f3f0] mb-4">
              Наша команда
            </h2>
            <div className="decorative-line mx-auto mb-4" />
            <p className="text-[#8b9caa] max-w-2xl mx-auto">
              Опытные адвокаты с многолетним стажем в органах прокуратуры, следствия и суда
            </p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {team.map((member) => (
              <Link
                key={member.id}
                href={`/team/${member.slug}`}
                className="bg-[#0f2133] border border-[#1e3a51]/30 rounded-xl p-6 hover:border-[#c9a962]/30 transition-all card-enhanced group"
              >
                {member.photo ? (
                  <div className="w-16 h-16 rounded-full overflow-hidden mb-4">
                    <Image src={member.photo} alt={member.name} width={64} height={64} className="w-full h-full object-cover" />
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
          </div>
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
            <div className="grid md:grid-cols-3 gap-6">
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
            </div>
          </div>
        </section>
      )}

      {/* CTA */}
      <section className="section-padding">
        <div className="container mx-auto max-w-4xl text-center">
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
        </div>
      </section>
    </>
  );
}
