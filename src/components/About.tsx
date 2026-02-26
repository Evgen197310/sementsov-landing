"use client";

import { Calendar, Clock, Globe, Briefcase, Scale, Gavel, Shield, Banknote, FileText, Building2, ScrollText, UserCheck, Heart, Home, Landmark, Users, Wheat, BookOpen, Tv, type LucideIcon } from "lucide-react";
import AnimateOnScroll from "./AnimateOnScroll";

const iconMap: Record<string, LucideIcon> = {
  Calendar, Clock, Globe, Briefcase, Scale, Gavel, Shield, Banknote, FileText, Building2, ScrollText, UserCheck, Heart, Home, Landmark, Users, Wheat, BookOpen, Tv,
};

interface Advantage {
  id: string;
  icon: string;
  title: string;
  description: string | null;
  sort_order: number;
}

interface AboutData {
  text1: string | null;
  text2: string | null;
}

interface AboutProps {
  about: AboutData | null;
  advantages: Advantage[];
  editable?: boolean;
  onEditAbout?: () => void;
  onEditAdvantage?: (adv: Advantage) => void;
}

export { iconMap };

export default function About({ about, advantages, editable, onEditAbout, onEditAdvantage }: AboutProps) {
  return (
    <section id="about" className="section-padding bg-[#0b1c2b] relative">
      <div className="max-w-7xl mx-auto">
        <AnimateOnScroll animation="fade-up">
          <div className="text-center mb-12">
            <span className="text-[#c9a962] text-sm uppercase tracking-widest font-medium mb-4 block">
              О коллегии
            </span>
            <h2
              className="text-3xl md:text-4xl lg:text-5xl font-bold text-[#efebe8] mb-6"
              style={{ fontFamily: "Playfair Display, serif" }}
            >
              Надёжная юридическая защита
            </h2>
            <div className="decorative-line mx-auto mb-6" />
          </div>
        </AnimateOnScroll>

        <AnimateOnScroll animation="fade-up" delay={100}>
          <div className={`max-w-3xl mx-auto mb-16 relative ${editable ? 'cursor-pointer group' : ''}`} onClick={() => editable && onEditAbout?.()}>
            {editable && (
              <div className="absolute -top-2 -right-2 w-8 h-8 bg-[#c9a962] rounded-lg flex items-center justify-center text-[#0b1c2b] opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity z-10">
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"/></svg>
              </div>
            )}
            <p className="text-[#7f97a5] text-lg leading-relaxed mb-6">
              {about?.text1 || ""}
            </p>
            <p className="text-[#7f97a5] text-lg leading-relaxed">
              {about?.text2 || ""}
            </p>
          </div>
        </AnimateOnScroll>

        <AnimateOnScroll animation="stagger">
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {advantages.map((item) => {
              const IconComponent = iconMap[item.icon] || Briefcase;
              return (
                <div
                  key={item.id}
                  className={`bg-[#1e3a51]/20 rounded-2xl p-6 border border-[#1e3a51]/50 text-center card-enhanced relative ${editable ? 'cursor-pointer group' : ''}`}
                  onClick={() => editable && onEditAdvantage?.(item)}
                >
                  {editable && (
                    <div className="absolute top-2 right-2 w-7 h-7 bg-[#c9a962] rounded-lg flex items-center justify-center text-[#0b1c2b] opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity z-10">
                      <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"/></svg>
                    </div>
                  )}
                  <div className="w-14 h-14 bg-[#c9a962]/10 rounded-xl flex items-center justify-center mx-auto mb-4">
                    <IconComponent className="w-7 h-7 text-[#c9a962]" />
                  </div>
                  <h3
                    className="text-lg font-semibold text-[#efebe8] mb-2"
                    style={{ fontFamily: "Playfair Display, serif" }}
                  >
                    {item.title}
                  </h3>
                  <p className="text-sm text-[#7f97a5]">{item.description}</p>
                </div>
              );
            })}
          </div>
        </AnimateOnScroll>
      </div>
    </section>
  );
}
