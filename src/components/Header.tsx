"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Phone, Mail } from "lucide-react";

interface ContactsData {
  phone: string | null;
  email: string | null;
  address: string | null;
  map_url: string | null;
  lat: number | null;
  lng: number | null;
}

interface HeaderProps {
  contacts: ContactsData;
}

export default function Header({ contacts }: HeaderProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setIsMenuOpen(false);
      }
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const navItems = [
    { href: "#about", label: "О коллегии" },
    { href: "#services", label: "Услуги" },
    { href: "#team", label: "Команда" },
    { href: "#cases", label: "Практика" },
    { href: "#contacts", label: "Контакты" },
  ];

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? "header-scrolled"
          : "bg-[#0b1c2b]/95 backdrop-blur-md"
      } border-b border-[#1e3a51]/50`}
    >
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        <div
          className={`header-inner flex items-center justify-between transition-all duration-300 ${
            isScrolled ? "h-16 md:h-[72px]" : "h-16 md:h-20"
          }`}
        >
          <Link href="/" className="flex items-center space-x-3">
            <div className="flex flex-col">
              <span
                className={`font-bold text-[#efebe8] tracking-wide leading-tight transition-all duration-300 ${
                  isScrolled ? "text-sm sm:text-base md:text-lg" : "text-sm sm:text-lg md:text-xl"
                }`}
                style={{ fontFamily: "Playfair Display, serif" }}
              >
                <span className="hidden sm:inline">СЕМЕНЦОВ И ПАРТНЁРЫ</span>
                <span className="sm:hidden">
                  СЕМЕНЦОВ
                  <br />
                  И ПАРТНЁРЫ
                </span>
              </span>
              <span
                className={`text-[#c9a962] uppercase tracking-widest leading-tight mt-0.5 transition-all duration-300 ${
                  isScrolled ? "text-[8px] sm:text-[9px]" : "text-[9px] sm:text-[10px]"
                }`}
              >
                Московская коллегия адвокатов
              </span>
            </div>
          </Link>

          <nav className="hidden lg:flex items-center space-x-8">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="text-[#7f97a5] hover:text-[#efebe8] transition-colors duration-300 text-sm font-medium relative group"
              >
                {item.label}
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-[#c9a962] transition-all duration-300 group-hover:w-full" />
              </Link>
            ))}
          </nav>

          <div className="hidden md:flex items-center space-x-6">
            <a
              href={`mailto:${contacts?.email || 'vsementsov11@mail.ru'}`}
              className="flex items-center space-x-2 text-[#7f97a5] hover:text-[#c9a962] transition-colors duration-300"
            >
              <Mail className="w-4 h-4" />
              <span className="text-sm hidden lg:inline">{contacts?.email || 'vsementsov11@mail.ru'}</span>
            </a>
            <a
              href={`tel:${(contacts?.phone || '+74956298250').replace(/[^\d+]/g, '')}`}
              className={`flex items-center space-x-2 bg-[#c9a962] hover:bg-[#ddc488] text-[#0b1c2b] rounded-full transition-all duration-300 ${
                isScrolled ? "px-4 py-2" : "px-5 py-2.5"
              }`}
            >
              <Phone className="w-4 h-4" />
              <span className="text-sm font-medium">{contacts?.phone || '+7 (495) 629-82-50'}</span>
            </a>
          </div>

          <button
            type="button"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className={`lg:hidden p-3 -mr-2 min-w-[48px] min-h-[48px] flex flex-col items-center justify-center gap-1.5 ${
              isMenuOpen ? "burger-open" : ""
            }`}
            aria-label={isMenuOpen ? "Закрыть меню" : "Открыть меню"}
          >
            <span className="burger-line" />
            <span className="burger-line" />
            <span className="burger-line" />
          </button>
        </div>

        <div
          className={`lg:hidden overflow-hidden transition-all duration-300 ease-in-out ${
            isMenuOpen ? "max-h-[400px] opacity-100" : "max-h-0 opacity-0"
          }`}
        >
          <div className="py-4 border-t border-[#1e3a51]/50">
            <nav className="flex flex-col">
              {navItems.map((item, index) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setIsMenuOpen(false)}
                  className="text-[#8b9caa] hover:text-[#efebe8] hover:bg-[#1e3a51]/30 transition-all duration-300 text-base font-medium px-4 py-4 min-h-[52px] flex items-center"
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  {item.label}
                </Link>
              ))}
              <div className="mt-4 pt-4 border-t border-[#1e3a51]/50 px-4 space-y-2">
                <a
                  href={`tel:${(contacts?.phone || '+74956298250').replace(/[^\d+]/g, '')}`}
                  className="flex items-center space-x-3 text-[#c9a962] font-medium py-3 min-h-[48px]"
                >
                  <Phone className="w-5 h-5" />
                  <span className="text-base">{contacts?.phone || '+7 (495) 629-82-50'}</span>
                </a>
                <a
                  href={`mailto:${contacts?.email || 'vsementsov11@mail.ru'}`}
                  className="flex items-center space-x-3 text-[#8b9caa] py-3 min-h-[48px]"
                >
                  <Mail className="w-5 h-5" />
                  <span className="text-base">{contacts?.email || 'vsementsov11@mail.ru'}</span>
                </a>
              </div>
            </nav>
          </div>
        </div>
      </div>
    </header>
  );
}
