"use client";

import { ExternalLink, Scale, Tv, BookOpen, Gavel, type LucideIcon } from "lucide-react";
import AnimateOnScroll from "./AnimateOnScroll";

const iconMap: Record<string, LucideIcon> = { Scale, Tv, BookOpen, Gavel };

interface CaseLink {
  id: string;
  case_id: string;
  text: string;
  url: string;
}

interface CaseItem {
  id: string;
  icon: string;
  title: string;
  category: string | null;
  description: string | null;
  sort_order: number;
  links?: CaseLink[];
}

interface CasesProps {
  cases: CaseItem[];
  editable?: boolean;
  onEdit?: (c: CaseItem) => void;
  onDelete?: (c: CaseItem) => void;
  onAdd?: () => void;
}

export default function Cases({ cases, editable, onEdit, onDelete, onAdd }: CasesProps) {
  return (
    <section id="cases" className="section-padding bg-[#0f2435] relative overflow-hidden">
      <div className="max-w-7xl mx-auto relative z-10">
        <AnimateOnScroll animation="fade-up">
          <div className="text-center mb-12">
            <span className="text-[#c9a962] text-sm uppercase tracking-widest font-medium mb-4 block">
              Результаты работы
            </span>
            <h2
              className="text-3xl md:text-4xl lg:text-5xl font-bold text-[#efebe8] mb-6"
              style={{ fontFamily: "Playfair Display, serif" }}
            >
              Практика и кейсы
            </h2>
            <div className="decorative-line mx-auto mb-6" />
            <p className="text-[#7f97a5] max-w-2xl mx-auto">
              Резонансные дела, экспертная деятельность и правовые прецеденты наших адвокатов
            </p>
          </div>
        </AnimateOnScroll>

        <div className="grid md:grid-cols-2 gap-6">
          {cases.map((item, index) => {
            const IconComponent = iconMap[item.icon] || Scale;
            return (
              <AnimateOnScroll key={item.id} animation="fade-up" delay={index * 100}>
                <div className={`bg-gradient-to-br from-[#1e3a51]/40 to-[#1e3a51]/20 rounded-2xl border border-[#1e3a51]/50 p-6 md:p-8 h-full card-enhanced relative ${editable ? 'group' : ''}`}>
                  {editable && (
                    <div className="absolute top-3 right-3 flex gap-1 z-10 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity">
                      <button onClick={() => onEdit?.(item)} className="w-8 h-8 bg-[#c9a962] rounded-lg flex items-center justify-center text-[#0b1c2b] hover:bg-[#ddc488] transition-colors">
                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"/></svg>
                      </button>
                      <button onClick={() => onDelete?.(item)} className="w-8 h-8 bg-red-600 rounded-lg flex items-center justify-center text-white hover:bg-red-700 transition-colors">
                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/></svg>
                      </button>
                    </div>
                  )}
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 bg-[#c9a962]/10 rounded-lg flex items-center justify-center flex-shrink-0">
                      <IconComponent className="w-5 h-5 text-[#c9a962]" />
                    </div>
                    <span className="text-xs text-[#c9a962] uppercase tracking-wider font-medium">
                      {item.category}
                    </span>
                  </div>

                  <h3
                    className="text-xl md:text-2xl font-bold text-[#efebe8] mb-4"
                    style={{ fontFamily: "Playfair Display, serif" }}
                  >
                    {item.title}
                  </h3>

                  <p className="text-[#7f97a5] leading-relaxed mb-6 text-sm">
                    {item.description}
                  </p>

                  <div className="flex flex-wrap gap-3">
                    {(item.links || []).map((link) => (
                      <a
                        key={link.url}
                        href={link.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 text-sm text-[#c9a962] hover:text-[#ddc488] font-medium transition-colors"
                      >
                        <ExternalLink className="w-4 h-4" />
                        {link.text}
                      </a>
                    ))}
                  </div>
                </div>
              </AnimateOnScroll>
            );
          })}
          {editable && (
            <button
              onClick={() => onAdd?.()}
              className="bg-[#1e3a51]/20 rounded-2xl border-2 border-dashed border-[#c9a962]/50 p-6 md:p-8 flex items-center justify-center min-h-[200px] hover:border-[#c9a962] transition-colors group"
            >
              <div className="text-center">
                <div className="w-12 h-12 bg-[#c9a962]/10 rounded-full flex items-center justify-center mx-auto mb-3 group-hover:bg-[#c9a962]/20 transition-colors">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#c9a962" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 5v14"/><path d="M5 12h14"/></svg>
                </div>
                <span className="text-[#c9a962] text-sm font-medium">Добавить кейс</span>
              </div>
            </button>
          )}
        </div>
      </div>
    </section>
  );
}
