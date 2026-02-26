"use client";

import { useState } from "react";
import Image from "next/image";
import { X, ExternalLink } from "lucide-react";
import AnimateOnScroll from "./AnimateOnScroll";

interface TeamMember {
  id: string;
  name: string;
  role: string;
  photo: string | null;
  short_bio: string | null;
  full_bio: string | null;
  link: string | null;
  sort_order: number;
}

interface TeamProps {
  members: TeamMember[];
  editable?: boolean;
  onEdit?: (member: TeamMember) => void;
  onDelete?: (member: TeamMember) => void;
  onAdd?: () => void;
}

export default function Team({ members, editable, onEdit, onDelete, onAdd }: TeamProps) {
  const [selectedMember, setSelectedMember] = useState<TeamMember | null>(null);

  return (
    <section id="team" className="section-padding bg-[#0b1c2b] relative">
      <div className="max-w-7xl mx-auto">
        <AnimateOnScroll animation="fade-up">
          <div className="text-center mb-12">
            <span className="text-[#c9a962] text-sm uppercase tracking-widest font-medium mb-4 block">
              Наши адвокаты
            </span>
            <h2
              className="text-3xl md:text-4xl lg:text-5xl font-bold text-[#efebe8] mb-6"
              style={{ fontFamily: "Playfair Display, serif" }}
            >
              Команда профессионалов
            </h2>
            <div className="decorative-line mx-auto mb-6" />
            <p className="text-[#7f97a5] max-w-2xl mx-auto">
              11 адвокатов с опытом работы в Генпрокуратуре, Верховном Суде, МВД и международных юридических фирмах
            </p>
          </div>
        </AnimateOnScroll>

        <AnimateOnScroll animation="stagger">
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {members.map((member) => (
              <div key={member.id} className="relative group">
                <button
                  onClick={() => !editable && setSelectedMember(member)}
                  className="bg-[#1e3a51]/20 rounded-2xl border border-[#1e3a51]/50 overflow-hidden card-enhanced relative group text-left w-full"
                >
                  <div className="relative overflow-hidden">
                    {member.photo ? (
                      <Image
                        src={member.photo}
                        alt={member.name}
                        width={900}
                        height={1198}
                        className="w-full h-auto object-contain group-hover:scale-105 transition-transform duration-500"
                        loading="lazy"
                      />
                    ) : (
                      <div className="w-full aspect-[3/4] bg-[#1e3a51]/40 flex items-center justify-center text-[#7f97a5] text-sm">Нет фото</div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0b1c2b] via-transparent to-transparent" />
                  </div>
                  <div className="p-4">
                    <h3
                      className="text-base font-semibold text-[#efebe8] mb-1 leading-tight"
                      style={{ fontFamily: "Playfair Display, serif" }}
                    >
                      {member.name}
                    </h3>
                    <p className="text-xs text-[#c9a962] mb-2">{member.role}</p>
                    <p className="text-xs text-[#7f97a5] line-clamp-2">{member.short_bio}</p>
                  </div>
                </button>
                {editable && (
                  <div className="absolute top-2 right-2 flex gap-1 z-10">
                    <button onClick={() => onEdit?.(member)} className="w-8 h-8 bg-[#c9a962] rounded-lg flex items-center justify-center text-[#0b1c2b] hover:bg-[#ddc488] transition-colors" title="Редактировать">
                      <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"/></svg>
                    </button>
                    <button onClick={() => onDelete?.(member)} className="w-8 h-8 bg-red-600 rounded-lg flex items-center justify-center text-white hover:bg-red-700 transition-colors" title="Удалить">
                      <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/></svg>
                    </button>
                  </div>
                )}
              </div>
            ))}
            {editable && (
              <button
                onClick={() => onAdd?.()}
                className="bg-[#1e3a51]/20 rounded-2xl border-2 border-dashed border-[#c9a962]/50 overflow-hidden flex items-center justify-center min-h-[300px] hover:border-[#c9a962] transition-colors group"
              >
                <div className="text-center">
                  <div className="w-12 h-12 bg-[#c9a962]/10 rounded-full flex items-center justify-center mx-auto mb-3 group-hover:bg-[#c9a962]/20 transition-colors">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#c9a962" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 5v14"/><path d="M5 12h14"/></svg>
                  </div>
                  <span className="text-[#c9a962] text-sm font-medium">Добавить адвоката</span>
                </div>
              </button>
            )}
          </div>
        </AnimateOnScroll>
      </div>

      {/* Modal */}
      {selectedMember && (
        <div className="modal-overlay" onClick={() => setSelectedMember(null)}>
          <div className="modal-content max-w-lg" onClick={(e) => e.stopPropagation()}>
            <div className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-4">
                  <div className="relative w-16 h-16 rounded-full overflow-hidden flex-shrink-0 border-2 border-[#c9a962]/50">
                    <Image
                      src={selectedMember.photo || "/team/placeholder.webp"}
                      alt={selectedMember.name}
                      fill
                      className="object-cover object-top"
                    />
                  </div>
                  <div>
                    <h3
                      className="text-xl font-bold text-[#efebe8]"
                      style={{ fontFamily: "Playfair Display, serif" }}
                    >
                      {selectedMember.name}
                    </h3>
                    <p className="text-sm text-[#c9a962]">{selectedMember.role}</p>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedMember(null)}
                  className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-[#1e3a51] transition-colors flex-shrink-0"
                >
                  <X className="w-5 h-5 text-[#7f97a5]" />
                </button>
              </div>
              <p className="text-[#7f97a5] leading-relaxed text-sm">{selectedMember.full_bio}</p>
              {selectedMember.link && (
                <a
                  href={selectedMember.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 mt-4 text-[#c9a962] hover:text-[#ddc488] text-sm font-medium transition-colors"
                >
                  <ExternalLink className="w-4 h-4" />
                  Персональный сайт
                </a>
              )}
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
