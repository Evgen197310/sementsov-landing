"use client";

import { useState, useEffect } from "react";
import { Phone, Scale, Shield, Users, Clock } from "lucide-react";
import Image from "next/image";
import AnimatedCounter from "./AnimatedCounter";

interface HeroData {
  subtitle: string | null;
  title: string | null;
  description: string | null;
  stat1_value: number | null;
  stat1_label: string | null;
  stat2_value: number | null;
  stat2_label: string | null;
  stat3_value: number | null;
  stat3_label: string | null;
}

interface ContactsData {
  phone: string | null;
  email: string | null;
  address: string | null;
  map_url: string | null;
  lat: number | null;
  lng: number | null;
}

interface HeroProps {
  hero: HeroData | null;
  contacts: ContactsData | null;
  editable?: boolean;
  onEdit?: () => void;
}

export default function Hero({ hero, contacts, editable, onEdit }: HeroProps) {
  const [parallaxOffset, setParallaxOffset] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      setParallaxOffset(window.scrollY * 0.3);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <section
      id="hero"
      className="relative min-h-screen pt-20 overflow-hidden"
      style={{
        background: "linear-gradient(135deg, #0b1c2b 0%, #1e3a51 50%, #0b1c2b 100%)",
      }}
    >
      {/* Background image */}
      <div className="absolute inset-0 opacity-15">
        <Image
          src="/hero-bg.webp"
          alt=""
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#0b1c2b]/80 via-[#0b1c2b]/50 to-[#0b1c2b]" />
      </div>

      {/* Decorative elements with parallax */}
      <div
        className="absolute inset-0 opacity-10 parallax-bg"
        style={{ transform: `translateY(${parallaxOffset}px)` }}
      >
        <div className="absolute top-20 left-10 w-96 h-96 bg-[#c9a962] rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-10 w-80 h-80 bg-[#1e3a51] rounded-full blur-3xl" />
      </div>

      {/* Decorative SVG lines */}
      <div className="absolute top-0 left-0 right-0 h-full overflow-hidden pointer-events-none">
        <svg className="absolute top-0 left-0 w-full h-full opacity-5" viewBox="0 0 1200 800">
          <path d="M0,400 Q300,200 600,400 T1200,400" stroke="#c9a962" strokeWidth="2" fill="none" />
          <path d="M0,500 Q300,300 600,500 T1200,500" stroke="#c9a962" strokeWidth="1" fill="none" />
        </svg>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 md:px-8 py-16 md:py-24">
        <div className="grid lg:grid-cols-2 gap-12 items-center min-h-[calc(100vh-200px)]">
          {/* Text Content */}
          <div className="animate-fadeInUp">
            {/* Mobile photo */}
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
                <div className="text-base sm:text-lg font-semibold text-[#efebe8]" style={{ fontFamily: "Playfair Display, serif" }}>
                  Семенцов В.А.
                </div>
                <div className="text-xs sm:text-sm text-[#c9a962]">
                  Председатель коллегии
                </div>
              </div>
            </div>

            <div className="mb-6">
              <span className="text-[#c9a962] text-sm uppercase tracking-widest font-medium">
                {hero?.subtitle || "С 1997 года на защите ваших интересов"}
              </span>
            </div>

            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-[#efebe8] mb-6 leading-tight" style={{ fontFamily: "Playfair Display, serif" }}>
              {hero?.title || "Московская коллегия адвокатов «Семенцов и Партнёры»"}
            </h1>

            <p className="text-lg md:text-xl text-[#7f97a5] mb-8 leading-relaxed max-w-xl">
              {hero?.description || "Юридическая защита бизнеса и граждан."}
            </p>

            {/* Key advantages mini-block */}
            <div className="grid grid-cols-2 gap-3 mb-8">
              <div className="flex items-center gap-3 bg-[#1e3a51]/30 rounded-xl p-3 border border-[#1e3a51]/50">
                <Scale className="w-5 h-5 text-[#c9a962] flex-shrink-0" />
                <span className="text-sm text-[#efebe8]">Все отрасли права</span>
              </div>
              <div className="flex items-center gap-3 bg-[#1e3a51]/30 rounded-xl p-3 border border-[#1e3a51]/50">
                <Clock className="w-5 h-5 text-[#c9a962] flex-shrink-0" />
                <span className="text-sm text-[#efebe8]">Круглосуточно</span>
              </div>
              <div className="flex items-center gap-3 bg-[#1e3a51]/30 rounded-xl p-3 border border-[#1e3a51]/50">
                <Shield className="w-5 h-5 text-[#c9a962] flex-shrink-0" />
                <span className="text-sm text-[#efebe8]">Адвокатская тайна</span>
              </div>
              <div className="flex items-center gap-3 bg-[#1e3a51]/30 rounded-xl p-3 border border-[#1e3a51]/50">
                <Users className="w-5 h-5 text-[#c9a962] flex-shrink-0" />
                <span className="text-sm text-[#efebe8]">11 адвокатов</span>
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-4 sm:gap-6 mb-8">
              <div className="text-center md:text-left">
                <div className="text-2xl sm:text-3xl md:text-4xl font-bold text-[#efebe8]" style={{ fontFamily: "Playfair Display, serif" }}>
                  <AnimatedCounter value={hero?.stat1_value ?? 27} duration={1800} suffix="+" />
                </div>
                <div className="text-xs sm:text-sm text-[#8b9caa]">{hero?.stat1_label || "лет практики"}</div>
              </div>
              <div className="text-center md:text-left">
                <div className="text-2xl sm:text-3xl md:text-4xl font-bold text-[#efebe8]" style={{ fontFamily: "Playfair Display, serif" }}>
                  <AnimatedCounter value={hero?.stat2_value ?? 11} duration={1200} />
                </div>
                <div className="text-xs sm:text-sm text-[#8b9caa]">{hero?.stat2_label || "адвокатов"}</div>
              </div>
              <div className="text-center md:text-left">
                <div className="text-2xl sm:text-3xl md:text-4xl font-bold text-[#efebe8]" style={{ fontFamily: "Playfair Display, serif" }}>
                  <AnimatedCounter value={hero?.stat3_value ?? 18} duration={1500} />
                </div>
                <div className="text-xs sm:text-sm text-[#8b9caa]">{hero?.stat3_label || "направлений права"}</div>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              <a
                href="#contacts"
                className="inline-flex items-center justify-center space-x-2 bg-[#c9a962] hover:bg-[#ddc488] text-[#0b1c2b] font-medium py-4 px-8 rounded-full transition-all duration-300 hover:shadow-lg hover:shadow-[#c9a962]/30"
              >
                <span>Записаться на консультацию</span>
              </a>
              <a
                href="tel:+74956298250"
                className="inline-flex items-center justify-center space-x-2 border-2 border-[#c9a962] text-[#c9a962] hover:bg-[#c9a962] hover:text-[#0b1c2b] font-medium py-4 px-8 rounded-full transition-all duration-300"
              >
                <Phone className="w-5 h-5" />
                <span>+7 (495) 629-82-50</span>
              </a>
            </div>
          </div>

          {/* Photo - Desktop */}
          <div className="relative animate-slideInRight hidden lg:block">
            <div className="relative z-10">
              <div className="relative w-full max-w-md mx-auto">
                <div className="relative overflow-hidden rounded-2xl">
                  <Image
                    src="/team/sementsov.webp"
                    alt="Семенцов Владимир Алексеевич — Председатель коллегии"
                    width={400}
                    height={500}
                    className="w-full h-auto object-cover"
                    priority
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0b1c2b]/70 to-transparent" />

                  <div className="absolute bottom-4 left-4 right-4 bg-[#0b1c2b]/80 backdrop-blur-sm rounded-xl p-4 border border-[#1e3a51]/50">
                    <div className="text-lg font-semibold text-[#efebe8]" style={{ fontFamily: "Playfair Display, serif" }}>
                      Семенцов Владимир Алексеевич
                    </div>
                    <div className="text-sm text-[#c9a962]">
                      Председатель Президиума коллегии
                    </div>
                    <div className="text-xs text-[#7f97a5] mt-1">
                      Следователь по особо важным делам Генпрокуратуры РФ
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-[#1e3a51]/30 rounded-full blur-3xl -z-10" />
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce hidden md:block">
        <div className="w-6 h-10 border-2 border-[#c9a962] rounded-full flex justify-center pt-2">
          <div className="w-1 h-3 bg-[#c9a962] rounded-full" />
        </div>
      </div>
    </section>
  );
}
