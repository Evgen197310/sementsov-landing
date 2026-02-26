import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Политика конфиденциальности",
  description: "Политика обработки персональных данных МКА «Семенцов и Партнёры»",
};

export default function PrivacyPage() {
  return (
    <main className="min-h-screen bg-[#0b1c2b] pt-24 pb-16 px-4 md:px-8">
      <div className="max-w-3xl mx-auto">
        <Link
          href="/"
          className="inline-flex items-center text-[#c9a962] hover:text-[#ddc488] text-sm mb-8 transition-colors"
        >
          ← Вернуться на главную
        </Link>

        <h1
          className="text-3xl md:text-4xl font-bold text-[#efebe8] mb-8"
          style={{ fontFamily: "Playfair Display, serif" }}
        >
          Политика обработки персональных данных
        </h1>

        <div className="prose prose-invert max-w-none text-[#7f97a5] space-y-6 text-sm leading-relaxed">
          <p>
            Настоящая Политика конфиденциальности определяет порядок обработки и защиты
            Московской коллегией адвокатов «Семенцов и Партнёры» (далее — Оператор)
            информации о физических лицах (далее — Пользователь), которая может быть
            получена Оператором при использовании сайта.
          </p>

          <h2 className="text-xl font-semibold text-[#efebe8] mt-8" style={{ fontFamily: "Playfair Display, serif" }}>
            1. Общие положения
          </h2>
          <p>
            Использование сайта означает безоговорочное согласие Пользователя с настоящей
            Политикой и указанными в ней условиями обработки его персональных данных.
            В случае несогласия с этими условиями Пользователь должен воздержаться от
            использования сайта.
          </p>

          <h2 className="text-xl font-semibold text-[#efebe8] mt-8" style={{ fontFamily: "Playfair Display, serif" }}>
            2. Персональные данные, обрабатываемые Оператором
          </h2>
          <p>Оператор может обрабатывать следующие данные Пользователя:</p>
          <ul className="list-disc pl-6 space-y-1">
            <li>Имя</li>
            <li>Номер телефона</li>
            <li>Адрес электронной почты</li>
            <li>Текст обращения</li>
          </ul>

          <h2 className="text-xl font-semibold text-[#efebe8] mt-8" style={{ fontFamily: "Playfair Display, serif" }}>
            3. Цели обработки персональных данных
          </h2>
          <p>Персональные данные обрабатываются в целях:</p>
          <ul className="list-disc pl-6 space-y-1">
            <li>Обратной связи с Пользователем</li>
            <li>Записи на юридическую консультацию</li>
            <li>Предоставления юридических услуг</li>
          </ul>

          <h2 className="text-xl font-semibold text-[#efebe8] mt-8" style={{ fontFamily: "Playfair Display, serif" }}>
            4. Защита персональных данных
          </h2>
          <p>
            Оператор принимает необходимые организационные и технические меры для защиты
            персональных данных Пользователя от неправомерного или случайного доступа,
            уничтожения, изменения, блокирования, копирования, распространения, а также
            от иных неправомерных действий третьих лиц.
          </p>

          <h2 className="text-xl font-semibold text-[#efebe8] mt-8" style={{ fontFamily: "Playfair Display, serif" }}>
            5. Контактная информация
          </h2>
          <p>
            Московская коллегия адвокатов «Семенцов и Партнёры»<br />
            107031, г. Москва, ул. Большая Дмитровка, д. 20/5, стр. 2, офис 20<br />
            Телефон: +7 (495) 629-82-50<br />
            Email: vsementsov11@mail.ru
          </p>
        </div>
      </div>
    </main>
  );
}
