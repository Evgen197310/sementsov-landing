import Link from "next/link";
import { Phone, ArrowRight, Scale, Shield, Landmark, Users, Briefcase, Handshake, Building, FileText } from "lucide-react";
import { AnimateOnScroll } from "@/components/AnimateOnScroll";

export const metadata = { title: "Стоимость услуг — МКА «Семенцов и Партнёры»" };

const individualServices = [
  { service: "Устная консультация (до 1 часа)", price: "от 5 000 ₽" },
  { service: "Письменное правовое заключение", price: "от 15 000 ₽" },
  { service: "Составление искового заявления", price: "от 15 000 ₽" },
  { service: "Составление жалобы, ходатайства", price: "от 10 000 ₽" },
  { service: "Ведение гражданского дела (1 инстанция)", price: "от 100 000 ₽" },
  { service: "Семейные споры (развод, раздел имущества, алименты)", price: "от 80 000 ₽" },
  { service: "Наследственные споры", price: "от 80 000 ₽" },
  { service: "Жилищные споры", price: "от 80 000 ₽" },
  { service: "Земельные споры", price: "от 100 000 ₽" },
  { service: "Трудовые споры", price: "от 60 000 ₽" },
  { service: "Представительство в апелляции / кассации", price: "от 80 000 ₽" },
];

const criminalServices = [
  { service: "Консультация по уголовному делу", price: "от 10 000 ₽" },
  { service: "Срочный выезд адвоката при задержании", price: "от 30 000 ₽" },
  { service: "Защита на стадии доследственной проверки", price: "от 80 000 ₽" },
  { service: "Защита на стадии дознания / следствия", price: "от 200 000 ₽" },
  { service: "Защита в суде первой инстанции", price: "от 250 000 ₽" },
  { service: "Защита по особо тяжким преступлениям", price: "от 350 000 ₽" },
  { service: "Защита в апелляционной инстанции", price: "от 100 000 ₽" },
  { service: "Защита в кассационной инстанции", price: "от 150 000 ₽" },
  { service: "Представительство в Верховном Суде РФ", price: "от 250 000 ₽" },
  { service: "Посещение СИЗО / ИВС", price: "от 20 000 ₽" },
];

const businessServices = [
  { service: "Арбитражный спор (1 инстанция)", price: "от 150 000 ₽" },
  { service: "Корпоративный спор", price: "от 200 000 ₽" },
  { service: "Взыскание долгов / убытков", price: "от 100 000 ₽" },
  { service: "Представительство в контролирующих органах", price: "от 80 000 ₽" },
  { service: "Исполнительное производство", price: "от 60 000 ₽" },
  { service: "Банкротство (сопровождение процедуры)", price: "от 200 000 ₽" },
  { service: "Корпоративный адвокат (абонемент)", price: "от 50 000 ₽/мес" },
  { service: "Медиация (сессия)", price: "от 30 000 ₽" },
];

const internationalServices = [
  { service: "Подготовка жалобы в ЕСПЧ", price: "от 300 000 ₽" },
  { service: "Представительство в ЕСПЧ", price: "индивидуально" },
  { service: "Международное правовое сопровождение", price: "индивидуально" },
  { service: "Защита активов за рубежом", price: "индивидуально" },
];

function PriceTable({
  icon: Icon,
  title,
  items,
}: {
  icon: React.ElementType;
  title: string;
  items: { service: string; price: string }[];
}) {
  return (
    <div className="bg-[#0f2133] border border-[#1e3a51]/30 rounded-xl overflow-hidden">
      <div className="flex items-center gap-3 px-6 py-4 border-b border-[#1e3a51]/30">
        <Icon className="w-5 h-5 text-[#c9a962]" />
        <h2 className="text-lg font-['Playfair_Display'] font-semibold text-[#f5f3f0]">
          {title}
        </h2>
      </div>
      <div className="divide-y divide-[#1e3a51]/20">
        {items.map((item, i) => (
          <div
            key={i}
            className="flex items-center justify-between px-6 py-3.5 hover:bg-[#1e3a51]/10 transition-colors"
          >
            <span className="text-[#c5cdd5] text-sm pr-4">{item.service}</span>
            <span className="text-[#c9a962] text-sm font-medium whitespace-nowrap">
              {item.price}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function PricesPage() {
  return (
    <>
      {/* Hero */}
      <section className="bg-gradient-to-b from-[#071420] to-[#0b1c2b] py-16 md:py-24">
        <div className="container mx-auto px-4 max-w-5xl">
          <h1 className="text-3xl md:text-5xl font-['Playfair_Display'] font-bold text-[#f5f3f0] mb-4">
            Стоимость услуг
          </h1>
          <div className="decorative-line mb-8" />
          <div className="max-w-3xl space-y-4">
            <p className="text-[#8b9caa] leading-relaxed">
              Стоимость юридической помощи определяется индивидуально после анализа
              обстоятельств дела с учётом его сложности, объёма работы и необходимых
              процессуальных действий.
            </p>
            <p className="text-[#8b9caa] leading-relaxed">
              Ниже приведены <strong className="text-[#c5cdd5]">ориентировочные диапазоны</strong> для
              понимания порядка расходов. Окончательную стоимость вы определяете
              непосредственно с вашим адвокатом.
            </p>
          </div>
          <div className="mt-8 inline-flex items-center gap-3 bg-[#c9a962]/10 border border-[#c9a962]/20 rounded-lg px-5 py-3">
            <Phone className="w-4 h-4 text-[#c9a962]" />
            <span className="text-[#c9a962] text-sm font-medium">
              Предварительная оценка по телефону — бесплатно
            </span>
          </div>
        </div>
      </section>

      {/* Price tables */}
      <section className="section-padding">
        <div className="container mx-auto px-4 max-w-5xl space-y-8">
          <AnimateOnScroll animation="fade-up">
            <PriceTable
              icon={Shield}
              title="Уголовное право"
              items={criminalServices}
            />
          </AnimateOnScroll>

          <AnimateOnScroll animation="fade-up" delay={100}>
            <PriceTable
              icon={Users}
              title="Услуги физическим лицам"
              items={individualServices}
            />
          </AnimateOnScroll>

          <AnimateOnScroll animation="fade-up" delay={200}>
            <PriceTable
              icon={Scale}
              title="Услуги юридическим лицам"
              items={businessServices}
            />
          </AnimateOnScroll>

          <AnimateOnScroll animation="fade-up" delay={300}>
            <PriceTable
              icon={Landmark}
              title="Международная практика и ЕСПЧ"
              items={internationalServices}
            />
          </AnimateOnScroll>
        </div>
      </section>

      {/* Disclaimer + factors */}
      <section className="section-padding bg-[#071420]">
        <div className="container mx-auto px-4 max-w-5xl">
          <AnimateOnScroll animation="fade-up">
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h2 className="text-xl font-['Playfair_Display'] font-semibold text-[#f5f3f0] mb-4">
                  От чего зависит стоимость
                </h2>
                <div className="space-y-3">
                  {[
                    "Сложность и категория дела",
                    "Объём материалов и количество эпизодов",
                    "Количество судебных заседаний",
                    "Необходимость выездов, командировок",
                    "Посещение следственных изоляторов",
                    "Участие нескольких адвокатов",
                    "Квалификация и опыт конкретного адвоката",
                  ].map((factor, i) => (
                    <div key={i} className="flex items-start gap-3">
                      <span className="w-1.5 h-1.5 bg-[#c9a962] rounded-full mt-2 flex-shrink-0" />
                      <span className="text-[#8b9caa] text-sm">{factor}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div>
                <h2 className="text-xl font-['Playfair_Display'] font-semibold text-[#f5f3f0] mb-4">
                  Порядок работы
                </h2>
                <div className="space-y-4">
                  {[
                    { step: "1", text: "Бесплатная предварительная оценка по телефону" },
                    { step: "2", text: "Очная консультация с анализом документов" },
                    { step: "3", text: "Согласование стоимости и заключение соглашения" },
                    { step: "4", text: "Все условия фиксируются в договоре — без скрытых доплат" },
                  ].map((item) => (
                    <div key={item.step} className="flex items-start gap-4">
                      <span className="w-8 h-8 bg-[#1e3a51]/50 rounded-lg flex items-center justify-center text-[#c9a962] text-sm font-semibold flex-shrink-0">
                        {item.step}
                      </span>
                      <span className="text-[#8b9caa] text-sm pt-1.5">{item.text}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </AnimateOnScroll>

          <div className="mt-12 p-5 bg-[#0b1c2b] border border-[#1e3a51]/30 rounded-xl">
            <p className="text-[#5a6f80] text-xs leading-relaxed">
              Информация о стоимости услуг носит ориентировочный характер и не является публичной офертой
              (ст. 437 ГК РФ). Окончательная стоимость определяется соглашением об оказании юридической
              помощи между адвокатом и доверителем с учётом конкретных обстоятельств дела.
            </p>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="section-padding">
        <AnimateOnScroll animation="fade-up" className="container mx-auto max-w-4xl text-center">
          <FileText className="w-10 h-10 text-[#c9a962] mx-auto mb-6" />
          <h2 className="text-2xl md:text-3xl font-['Playfair_Display'] font-semibold text-[#f5f3f0] mb-4">
            Узнайте точную стоимость
          </h2>
          <p className="text-[#8b9caa] mb-8 max-w-xl mx-auto">
            Позвоните нам или оставьте заявку — адвокат оценит вашу ситуацию
            и назовёт точную стоимость до начала работы
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <a href="tel:+74956298250" className="btn-primary inline-flex items-center gap-2">
              <Phone className="w-4 h-4" />
              +7 (495) 629 82 50
            </a>
            <Link href="/contacts" className="btn-outline inline-flex items-center gap-2">
              Оставить заявку
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </AnimateOnScroll>
      </section>
    </>
  );
}
