"use client";

import Link from "next/link";
import { Phone, Mail, MapPin } from "lucide-react";

interface ContactsData {
  phone: string | null;
  email: string | null;
  address: string | null;
  map_url: string | null;
  lat: number | null;
  lng: number | null;
}

interface FooterProps {
  contacts: ContactsData | null;
}

export default function Footer({ contacts }: FooterProps) {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-[#0b1c2b] border-t border-[#1e3a51]/50">
      <div className="max-w-7xl mx-auto px-4 md:px-8 py-12">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          {/* Logo and description */}
          <div className="lg:col-span-2">
            <Link href="/" className="inline-block mb-4">
              <div className="flex flex-col">
                <span
                  className="text-2xl font-bold text-[#efebe8] tracking-wide"
                  style={{ fontFamily: "Playfair Display, serif" }}
                >
                  Семенцов и Партнёры
                </span>
                <span className="text-xs text-[#c9a962] uppercase tracking-widest">
                  Московская коллегия адвокатов
                </span>
              </div>
            </Link>
            <p className="text-[#7f97a5] text-sm leading-relaxed max-w-lg mb-4">
              Юридическая компания, работающая в России с 1997 года. Комплексная правовая
              защита бизнеса и граждан. Международное партнёрство с адвокатскими
              образованиями Европы и Америки.
            </p>
            <div className="text-[#7f97a5] text-sm">
              <p>{contacts?.address || '107031, г. Москва, ул. Большая Дмитровка, д. 20/5, стр. 2, офис 20'}</p>
            </div>
          </div>

          {/* Quick links */}
          <div>
            <h4
              className="text-lg font-semibold text-[#efebe8] mb-4"
              style={{ fontFamily: "Playfair Display, serif" }}
            >
              Навигация
            </h4>
            <ul className="space-y-3">
              {[
                { href: "#about", label: "О коллегии" },
                { href: "#services", label: "Услуги" },
                { href: "#team", label: "Команда" },
                { href: "#cases", label: "Практика" },
                { href: "#contacts", label: "Контакты" },
              ].map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="text-[#7f97a5] hover:text-[#c9a962] transition-colors duration-300 text-sm"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact info */}
          <div>
            <h4
              className="text-lg font-semibold text-[#efebe8] mb-4"
              style={{ fontFamily: "Playfair Display, serif" }}
            >
              Контакты
            </h4>
            <ul className="space-y-4">
              <li>
                <a
                  href={`tel:${(contacts?.phone || '+74956298250').replace(/[^\d+]/g, '')}`}
                  className="flex items-center gap-3 text-[#7f97a5] hover:text-[#c9a962] transition-colors duration-300"
                >
                  <Phone className="w-4 h-4 text-[#c9a962]" />
                  <span className="text-sm">{contacts?.phone || '+7 (495) 629-82-50'}</span>
                </a>
              </li>
              <li>
                <a
                  href={`mailto:${contacts?.email || 'vsementsov11@mail.ru'}`}
                  className="flex items-center gap-3 text-[#7f97a5] hover:text-[#c9a962] transition-colors duration-300"
                >
                  <Mail className="w-4 h-4 text-[#c9a962]" />
                  <span className="text-sm">{contacts?.email || 'vsementsov11@mail.ru'}</span>
                </a>
              </li>
              <li>
                <div className="flex items-start gap-3 text-[#7f97a5]">
                  <MapPin className="w-4 h-4 text-[#c9a962] mt-0.5" />
                  <span className="text-sm">
                    {contacts?.address || 'г. Москва, ул. Б. Дмитровка, д. 20/5, стр. 2, оф. 20'}
                  </span>
                </div>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-[#1e3a51]/50 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm text-[#7f97a5]">
              © 1997–{currentYear} МКА «Семенцов и Партнёры». Все права защищены.
            </p>
            <a
              href="/privacy"
              className="text-xs text-[#7f97a5] hover:text-[#c9a962] transition-colors"
            >
              Политика обработки персональных данных
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
