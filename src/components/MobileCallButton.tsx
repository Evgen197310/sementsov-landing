"use client";

import { Phone, ChevronUp } from "lucide-react";
import { useState, useEffect } from "react";

export default function MobileCallButton() {
  const [showScrollTop, setShowScrollTop] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 400);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <>
      {showScrollTop && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-6 right-6 z-50 hidden lg:flex items-center justify-center w-12 h-12 bg-[#1a3a52] hover:bg-[#254a66] text-[#c9a962] border border-[#c9a962]/30 rounded-full shadow-lg transition-all duration-300 hover:scale-110 active:scale-95"
          aria-label="Наверх"
        >
          <ChevronUp className="w-5 h-5" />
        </button>
      )}

      <div className="fixed bottom-6 right-6 z-50 flex lg:hidden flex-col gap-3">
        {showScrollTop && (
          <button
            onClick={scrollToTop}
            className="flex items-center justify-center w-14 h-14 bg-[#1a3a52] hover:bg-[#254a66] text-[#c9a962] border border-[#c9a962]/30 rounded-full shadow-lg transition-all duration-300 hover:scale-110 active:scale-95"
            aria-label="Наверх"
          >
            <ChevronUp className="w-6 h-6" />
          </button>
        )}

        <a
          href="tel:+74956298250"
          className="relative flex items-center justify-center w-16 h-16 bg-[#c9a962] hover:bg-[#ddc488] text-[#0b1c2b] rounded-full shadow-lg shadow-[#c9a962]/30 transition-all duration-300 hover:scale-110 active:scale-95"
          aria-label="Позвонить"
        >
          <Phone className="w-7 h-7" />
          <span className="absolute inset-0 rounded-full bg-[#c9a962] animate-ping opacity-25" />
        </a>
      </div>
    </>
  );
}
