"use client";

import { useState } from "react";
import { Scale, Building2, FileText, Shield, Gavel, Users, Banknote, Home, Heart, Landmark, Briefcase, HandshakeIcon, UserCheck, ScrollText, Wheat, type LucideIcon } from "lucide-react";
import AnimateOnScroll from "./AnimateOnScroll";

const iconMap: Record<string, LucideIcon> = {
  Scale, Building2, FileText, Shield, Gavel, Users, Banknote, Home, Heart, Landmark, Briefcase, HandshakeIcon, UserCheck, ScrollText, Wheat,
};

interface ServiceItem {
  id: string;
  category: string;
  icon: string;
  title: string;
  description: string | null;
  sort_order: number;
}

interface ServicesProps {
  services: ServiceItem[];
  editable?: boolean;
  onEdit?: (service: ServiceItem) => void;
  onDelete?: (service: ServiceItem) => void;
  onAdd?: (category: string) => void;
}

export default function Services({ services: allServices, editable, onEdit, onDelete, onAdd }: ServicesProps) {
  const [activeTab, setActiveTab] = useState<"business" | "personal">("business");

  const services = allServices.filter(s => s.category === activeTab);

  return (
    <section id="services" className="section-padding bg-[#0f2435] relative overflow-hidden">
      <div className="max-w-7xl mx-auto relative z-10">
        <AnimateOnScroll animation="fade-up">
          <div className="text-center mb-12">
            <span className="text-[#c9a962] text-sm uppercase tracking-widest font-medium mb-4 block">
              Направления практики
            </span>
            <h2
              className="text-3xl md:text-4xl lg:text-5xl font-bold text-[#efebe8] mb-6"
              style={{ fontFamily: "Playfair Display, serif" }}
            >
              Наши услуги
            </h2>
            <div className="decorative-line mx-auto mb-8" />

            {/* Tabs */}
            <div className="inline-flex bg-[#1e3a51]/30 rounded-full p-1 border border-[#1e3a51]/50">
              <button
                onClick={() => setActiveTab("business")}
                className={`px-6 py-3 rounded-full text-sm font-medium transition-all duration-300 min-h-[44px] ${
                  activeTab === "business"
                    ? "bg-[#c9a962] text-[#0b1c2b]"
                    : "text-[#7f97a5] hover:text-[#efebe8]"
                }`}
              >
                Для бизнеса
              </button>
              <button
                onClick={() => setActiveTab("personal")}
                className={`px-6 py-3 rounded-full text-sm font-medium transition-all duration-300 min-h-[44px] ${
                  activeTab === "personal"
                    ? "bg-[#c9a962] text-[#0b1c2b]"
                    : "text-[#7f97a5] hover:text-[#efebe8]"
                }`}
              >
                Для граждан
              </button>
            </div>
          </div>
        </AnimateOnScroll>

        <AnimateOnScroll animation="stagger" key={activeTab}>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.map((service) => {
              const IconComponent = iconMap[service.icon] || Scale;
              return (
                <div
                  key={service.id}
                  className={`bg-[#1e3a51]/20 rounded-2xl p-6 border border-[#1e3a51]/50 card-enhanced relative group ${editable ? 'cursor-pointer' : ''}`}
                  onClick={() => editable && onEdit?.(service)}
                >
                  {editable && (
                    <div className="absolute top-2 right-2 flex gap-1 z-10 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity">
                      <button onClick={(e) => { e.stopPropagation(); onEdit?.(service); }} className="w-7 h-7 bg-[#c9a962] rounded-lg flex items-center justify-center text-[#0b1c2b] hover:bg-[#ddc488] transition-colors">
                        <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"/></svg>
                      </button>
                      <button onClick={(e) => { e.stopPropagation(); onDelete?.(service); }} className="w-7 h-7 bg-red-600 rounded-lg flex items-center justify-center text-white hover:bg-red-700 transition-colors">
                        <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/></svg>
                      </button>
                    </div>
                  )}
                  <div className="w-12 h-12 bg-[#c9a962]/10 rounded-xl flex items-center justify-center mb-4 group-hover:bg-[#c9a962]/20 transition-colors duration-300">
                    <IconComponent className="w-6 h-6 text-[#c9a962]" />
                  </div>
                  <h3
                    className="text-lg font-semibold text-[#efebe8] mb-2"
                    style={{ fontFamily: "Playfair Display, serif" }}
                  >
                    {service.title}
                  </h3>
                  <p className="text-sm text-[#7f97a5] leading-relaxed">
                    {service.description}
                  </p>
                </div>
              );
            })}
            {editable && (
              <button
                onClick={() => onAdd?.(activeTab)}
                className="bg-[#1e3a51]/20 rounded-2xl p-6 border-2 border-dashed border-[#c9a962]/50 flex items-center justify-center min-h-[150px] hover:border-[#c9a962] transition-colors group"
              >
                <div className="text-center">
                  <div className="w-10 h-10 bg-[#c9a962]/10 rounded-full flex items-center justify-center mx-auto mb-2 group-hover:bg-[#c9a962]/20 transition-colors">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#c9a962" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 5v14"/><path d="M5 12h14"/></svg>
                  </div>
                  <span className="text-[#c9a962] text-sm font-medium">Добавить услугу</span>
                </div>
              </button>
            )}
          </div>
        </AnimateOnScroll>

        {/* Bottom CTA */}
        <AnimateOnScroll animation="fade-up" delay={200}>
          <div className="mt-12 text-center">
            <p className="text-[#7f97a5] mb-6">
              Не нашли нужную услугу? Позвоните — подберём решение для вашей ситуации.
            </p>
            <a
              href="tel:+74956298250"
              className="inline-flex items-center justify-center gap-2 bg-[#c9a962] hover:bg-[#ddc488] text-[#0b1c2b] font-medium py-3 px-8 rounded-full transition-all duration-300 hover:shadow-lg hover:shadow-[#c9a962]/30"
            >
              +7 (495) 629-82-50
            </a>
          </div>
        </AnimateOnScroll>
      </div>
    </section>
  );
}
