import { Phone, Mail, MapPin, Clock } from "lucide-react";

export const metadata = { title: "Контакты — МКА «Семенцов и Партнёры»" };

export default function ContactsPage() {
  return (
    <>
      <section className="bg-gradient-to-b from-[#071420] to-[#0b1c2b] py-16 md:py-24">
        <div className="container mx-auto px-4 max-w-5xl">
          <h1 className="text-3xl md:text-5xl font-['Playfair_Display'] font-bold text-[#f5f3f0] mb-4">
            Контакты
          </h1>
          <div className="decorative-line" />
        </div>
      </section>
      <section className="section-padding">
        <div className="container mx-auto px-4 max-w-5xl">
          <div className="grid md:grid-cols-2 gap-12">
            <div className="space-y-8">
              <div className="flex gap-4">
                <MapPin className="w-6 h-6 text-[#c9a962] flex-shrink-0 mt-1" />
                <div>
                  <h2 className="text-[#f5f3f0] font-semibold mb-1">Адрес</h2>
                  <p className="text-[#8b9caa]">
                    107031 Москва, ул. Большая Дмитровка<br />
                    д.20/5, строение 2, офис 20
                  </p>
                </div>
              </div>
              <div className="flex gap-4">
                <Phone className="w-6 h-6 text-[#c9a962] flex-shrink-0 mt-1" />
                <div>
                  <h2 className="text-[#f5f3f0] font-semibold mb-1">Телефон</h2>
                  <a href="tel:+74956298250" className="text-[#8b9caa] hover:text-[#c9a962] transition-colors text-lg">
                    +7 (495) 629 82 50
                  </a>
                </div>
              </div>
              <div className="flex gap-4">
                <Mail className="w-6 h-6 text-[#c9a962] flex-shrink-0 mt-1" />
                <div>
                  <h2 className="text-[#f5f3f0] font-semibold mb-1">Email</h2>
                  <a href="mailto:vsementsov11@mail.ru" className="text-[#8b9caa] hover:text-[#c9a962] transition-colors">
                    vsementsov11@mail.ru
                  </a>
                </div>
              </div>
              <div className="flex gap-4">
                <Clock className="w-6 h-6 text-[#c9a962] flex-shrink-0 mt-1" />
                <div>
                  <h2 className="text-[#f5f3f0] font-semibold mb-1">Режим работы</h2>
                  <p className="text-[#8b9caa]">Круглосуточно</p>
                </div>
              </div>

              {/* Press contacts tab */}
              <div className="mt-8 bg-[#0f2133] border border-[#1e3a51]/30 rounded-xl p-6">
                <h3 className="text-[#c9a962] font-semibold mb-3">Контакты пресслужбы</h3>
                <p className="text-[#8b9caa] text-sm mb-3">
                  Мы открыты для сотрудничества с представителями журналистского сообщества
                  по любым вопросам из юридической сферы.
                </p>
                <p className="text-[#8b9caa] text-sm">
                  <strong className="text-[#c5cdd5]">Email:</strong>{" "}
                  <a href="mailto:sementsov11@mail.ru" className="hover:text-[#c9a962] transition-colors">
                    sementsov11@mail.ru
                  </a>
                </p>
              </div>
            </div>

            {/* Map */}
            <div className="bg-[#0f2133] border border-[#1e3a51]/30 rounded-xl overflow-hidden min-h-[400px]">
              <iframe
                src="https://yandex.ru/map-widget/v1/?um=constructor%3A7f6c8e3a0f1d4b2e8c9a5d3f7e1b4a6c&source=constructor"
                width="100%"
                height="100%"
                frameBorder="0"
                style={{ minHeight: 400, border: 0 }}
                title="Карта — МКА Семенцов и Партнёры"
              />
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
