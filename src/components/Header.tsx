"use client";

import { useState } from "react";
import Link from "next/link";
import { Phone, Mail, Clock, Menu, X, ChevronDown } from "lucide-react";

const servicesIndividuals = [
  { title: "Юридические консультации", href: "/services/individuals/consultations" },
  { title: "Составление исковых заявлений", href: "/services/individuals/claims" },
  { title: "Жилищное право", href: "/services/individuals/housing" },
  { title: "Семейное право", href: "/services/individuals/family" },
  { title: "Наследственное право", href: "/services/individuals/inheritance" },
  { title: "Трудовое право", href: "/services/individuals/labor" },
  { title: "Земельное право", href: "/services/individuals/land" },
  { title: "Уголовное право", href: "/services/individuals/criminal" },
  { title: "Корпоративное право", href: "/services/individuals/corporate" },
];

const servicesLegal = [
  { title: "Арбитраж", href: "/services/legal/arbitration" },
  { title: "Представительство в судах", href: "/services/legal/court-representation" },
  { title: "Защита интересов в контр. органах", href: "/services/legal/regulatory" },
  { title: "Взыскание долгов", href: "/services/legal/debt-collection" },
  { title: "Взыскание убытков", href: "/services/legal/damages" },
  { title: "Корпоративные споры", href: "/services/legal/corporate-disputes" },
  { title: "Исполнительное производство", href: "/services/legal/enforcement" },
  { title: "Корпоративный адвокат", href: "/services/legal/corporate-lawyer" },
  { title: "Медиация", href: "/services/legal/mediation" },
];

const mediaLinks = [
  { title: "Новости", href: "/media/news" },
  { title: "Коллегия в СМИ", href: "/media/press" },
  { title: "Законодательство", href: "/media/legislation" },
  { title: "Научные труды", href: "/media/publications" },
];

export function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);

  return (
    <>
      {/* Top bar */}
      <div className="bg-[#0a1929] border-b border-[#1e3a51]/50 text-sm hidden md:block">
        <div className="container mx-auto flex items-center justify-between py-2 px-4">
          <div className="flex items-center gap-6 text-[#8b9caa]">
            <span className="flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-[#c9a962]" />
              Круглосуточно
            </span>
            <a href="tel:+74956298250" className="flex items-center gap-1.5 hover:text-[#c9a962] transition-colors">
              <Phone className="w-3.5 h-3.5 text-[#c9a962]" />
              +7 (495) 629 82 50
            </a>
            <a href="mailto:vsementsov11@mail.ru" className="flex items-center gap-1.5 hover:text-[#c9a962] transition-colors">
              <Mail className="w-3.5 h-3.5 text-[#c9a962]" />
              vsementsov11@mail.ru
            </a>
          </div>
          <Link href="/contacts" className="text-[#c9a962] hover:text-[#ddc488] transition-colors text-xs font-medium uppercase tracking-wider">
            Записаться на консультацию
          </Link>
        </div>
      </div>

      {/* Main header */}
      <header className="sticky top-0 z-50 bg-[#0b1c2b]/95 backdrop-blur-md border-b border-[#1e3a51]/30">
        <div className="container mx-auto flex items-center justify-between h-16 md:h-20 px-4">
          <Link href="/" className="flex flex-col">
            <span className="text-lg md:text-xl font-['Playfair_Display'] font-semibold text-[#f5f3f0]">
              Семенцов <span className="text-[#c9a962]">&</span> Партнёры
            </span>
            <span className="text-[10px] md:text-xs text-[#8b9caa] tracking-wider uppercase">
              Коллегия адвокатов
            </span>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden lg:flex items-center gap-1">
            <NavLink href="/">Главная</NavLink>
            <NavLink href="/about">О коллегии</NavLink>

            <Dropdown
              label="Услуги"
              active={activeDropdown === "services"}
              onOpen={() => setActiveDropdown("services")}
              onToggle={() => setActiveDropdown(activeDropdown === "services" ? null : "services")}
              onClose={() => setActiveDropdown(null)}
            >
              <div className="flex gap-8 p-6 min-w-[600px]">
                <div>
                  <Link href="/services/individuals" className="text-[#c9a962] text-xs font-semibold uppercase tracking-wider mb-3 block hover:text-[#ddc488]">
                    Физическим лицам
                  </Link>
                  {servicesIndividuals.map((s) => (
                    <Link key={s.href} href={s.href} className="block py-1 text-sm text-[#8b9caa] hover:text-[#f5f3f0] transition-colors" onClick={() => setActiveDropdown(null)}>
                      {s.title}
                    </Link>
                  ))}
                </div>
                <div>
                  <Link href="/services/legal" className="text-[#c9a962] text-xs font-semibold uppercase tracking-wider mb-3 block hover:text-[#ddc488]">
                    Юридическим лицам
                  </Link>
                  {servicesLegal.map((s) => (
                    <Link key={s.href} href={s.href} className="block py-1 text-sm text-[#8b9caa] hover:text-[#f5f3f0] transition-colors" onClick={() => setActiveDropdown(null)}>
                      {s.title}
                    </Link>
                  ))}
                </div>
              </div>
            </Dropdown>

            <NavLink href="/team">Команда</NavLink>
            <NavLink href="/practice">Практика</NavLink>

            <Dropdown
              label="Медиа"
              active={activeDropdown === "media"}
              onOpen={() => setActiveDropdown("media")}
              onToggle={() => setActiveDropdown(activeDropdown === "media" ? null : "media")}
              onClose={() => setActiveDropdown(null)}
            >
              <div className="p-4 min-w-[220px]">
                {mediaLinks.map((m) => (
                  <Link key={m.href} href={m.href} className="block py-2 text-sm text-[#8b9caa] hover:text-[#f5f3f0] transition-colors" onClick={() => setActiveDropdown(null)}>
                    {m.title}
                  </Link>
                ))}
              </div>
            </Dropdown>

            <NavLink href="/documents">Документы</NavLink>
            <NavLink href="/partners">Партнёры</NavLink>
            <NavLink href="/contacts">Контакты</NavLink>
          </nav>

          {/* Mobile: phone + burger */}
          <div className="flex items-center gap-3 lg:hidden">
            <a href="tel:+74956298250" className="p-2 text-[#c9a962]">
              <Phone className="w-5 h-5" />
            </a>
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="p-2 text-[#f5f3f0]"
              aria-label="Меню"
            >
              {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        <div
          className={`lg:hidden bg-[#0b1c2b] border-t border-[#1e3a51]/30 overflow-hidden transition-all duration-300 ease-in-out ${
            mobileOpen ? "max-h-[80vh] opacity-100 overflow-y-auto" : "max-h-0 opacity-0"
          }`}
        >
            <div className="container mx-auto px-4 py-4 space-y-1">
              <MobileLink href="/" onClick={() => setMobileOpen(false)}>Главная</MobileLink>
              <MobileLink href="/about" onClick={() => setMobileOpen(false)}>О коллегии</MobileLink>
              <MobileSection title="Услуги">
                <MobileLink href="/services/individuals" onClick={() => setMobileOpen(false)} sub>Физическим лицам</MobileLink>
                <MobileLink href="/services/legal" onClick={() => setMobileOpen(false)} sub>Юридическим лицам</MobileLink>
                <MobileLink href="/services/legal/mediation" onClick={() => setMobileOpen(false)} sub>Медиация</MobileLink>
              </MobileSection>
              <MobileLink href="/team" onClick={() => setMobileOpen(false)}>Команда</MobileLink>
              <MobileLink href="/practice" onClick={() => setMobileOpen(false)}>Практика</MobileLink>
              <MobileSection title="Медиа">
                {mediaLinks.map((m) => (
                  <MobileLink key={m.href} href={m.href} onClick={() => setMobileOpen(false)} sub>{m.title}</MobileLink>
                ))}
              </MobileSection>
              <MobileLink href="/documents" onClick={() => setMobileOpen(false)}>Документы</MobileLink>
              <MobileLink href="/partners" onClick={() => setMobileOpen(false)}>Партнёры</MobileLink>
              <MobileLink href="/career" onClick={() => setMobileOpen(false)}>Карьера</MobileLink>
              <MobileLink href="/contacts" onClick={() => setMobileOpen(false)}>Контакты</MobileLink>
              <div className="pt-4 border-t border-[#1e3a51]/30">
                <a href="tel:+74956298250" className="block py-2 text-[#c9a962] font-medium">
                  +7 (495) 629 82 50
                </a>
                <a href="mailto:vsementsov11@mail.ru" className="block py-2 text-[#8b9caa] text-sm">
                  vsementsov11@mail.ru
                </a>
              </div>
            </div>
        </div>
      </header>
    </>
  );
}

function NavLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link
      href={href}
      className="px-3 py-2 text-sm text-[#c5cdd5] hover:text-[#f5f3f0] transition-colors font-medium"
    >
      {children}
    </Link>
  );
}

function Dropdown({
  label,
  active,
  onOpen,
  onToggle,
  onClose,
  children,
}: {
  label: string;
  active: boolean;
  onOpen: () => void;
  onToggle: () => void;
  onClose: () => void;
  children: React.ReactNode;
}) {
  return (
    <div className="group relative" onMouseEnter={onOpen} onMouseLeave={onClose}>
      <button
        onClick={onToggle}
        className="flex items-center gap-1 px-3 py-2 text-sm text-[#c5cdd5] hover:text-[#f5f3f0] transition-colors font-medium"
      >
        {label}
        <ChevronDown className={`w-3.5 h-3.5 transition-transform ${active ? "rotate-180" : ""}`} />
      </button>
      <div className={`absolute top-full left-0 pt-1 z-50 transition-opacity duration-150
        invisible opacity-0 group-hover:visible group-hover:opacity-100
        ${active ? "!visible !opacity-100" : ""}`}
      >
        <div className="bg-[#0f2133] border border-[#1e3a51]/50 rounded-lg shadow-2xl">
          {children}
        </div>
      </div>
    </div>
  );
}

function MobileLink({
  href,
  children,
  onClick,
  sub,
}: {
  href: string;
  children: React.ReactNode;
  onClick: () => void;
  sub?: boolean;
}) {
  return (
    <Link
      href={href}
      onClick={onClick}
      className={`block py-2.5 ${sub ? "pl-6 text-sm text-[#8b9caa]" : "text-[#f5f3f0] font-medium"} hover:text-[#c9a962] transition-colors`}
    >
      {children}
    </Link>
  );
}

function MobileSection({ title, children }: { title: string; children: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  return (
    <div>
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between py-2.5 text-[#f5f3f0] font-medium"
      >
        {title}
        <ChevronDown className={`w-4 h-4 transition-transform ${open ? "rotate-180" : ""}`} />
      </button>
      {open && <div className="pb-2">{children}</div>}
    </div>
  );
}
