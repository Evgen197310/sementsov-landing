"use client";

import { useState } from "react";
import { Phone, Send, MapPin, Mail, Clock } from "lucide-react";
import AnimateOnScroll from "./AnimateOnScroll";

interface ContactsData {
  phone: string | null;
  email: string | null;
  address: string | null;
  map_url: string | null;
  lat: number | null;
  lng: number | null;
}

interface ContactFormProps {
  contacts: ContactsData | null;
  editable?: boolean;
  onEdit?: () => void;
}

export default function ContactForm({ contacts, editable, onEdit }: ContactFormProps) {
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    message: "",
    consent: false,
  });

  const [sending, setSending] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<"idle" | "success" | "error">("idle");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSending(true);
    try {
      const res = await fetch("/api/sendForm", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.name,
          phone: formData.phone,
          email: formData.email,
          message: formData.message,
        }),
      });
      if (res.ok) {
        setSubmitStatus("success");
        setFormData({ name: "", phone: "", email: "", message: "", consent: false });
        setTimeout(() => setSubmitStatus("idle"), 5000);
      } else {
        setSubmitStatus("error");
        setTimeout(() => setSubmitStatus("idle"), 5000);
      }
    } catch {
      setSubmitStatus("error");
      setTimeout(() => setSubmitStatus("idle"), 5000);
    } finally {
      setSending(false);
    }
  };

  return (
    <section id="contacts" className="section-padding bg-[#0b1c2b] relative overflow-hidden">
      <div className="max-w-7xl mx-auto relative z-10">
        {editable && (
          <div className="flex justify-end mb-2">
            <button onClick={() => onEdit?.()} className="bg-[#c9a962] hover:bg-[#ddc488] text-[#0b1c2b] rounded-lg px-3 py-2 text-xs font-medium flex items-center gap-1.5 shadow-lg z-20">
              <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"/></svg>
              Редактировать контакты
            </button>
          </div>
        )}
        <AnimateOnScroll animation="fade-up">
          <div className="text-center mb-12">
            <span className="text-[#c9a962] text-sm uppercase tracking-widest font-medium mb-4 block">
              Свяжитесь с нами
            </span>
            <h2
              className="text-3xl md:text-4xl lg:text-5xl font-bold text-[#efebe8] mb-6"
              style={{ fontFamily: "Playfair Display, serif" }}
            >
              Записаться на консультацию
            </h2>
            <div className="decorative-line mx-auto" />
          </div>
        </AnimateOnScroll>

        <div className="grid lg:grid-cols-2 gap-12 items-start">
          {/* Left - contact info */}
          <AnimateOnScroll animation="fade-left">
            <div>
              <p className="text-lg text-[#7f97a5] mb-8 leading-relaxed">
                Для записи на консультацию позвоните нам или оставьте заявку.
                Мы работаем круглосуточно и готовы помочь в любой ситуации.
              </p>

              <div className="space-y-6 mb-8">
                <a
                  href={`tel:${(contacts?.phone || '+74956298250').replace(/[^\d+]/g, '')}`}
                  className="flex items-center gap-4 group"
                >
                  <div className="w-12 h-12 bg-[#c9a962]/10 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:bg-[#c9a962]/20 transition-colors">
                    <Phone className="w-5 h-5 text-[#c9a962]" />
                  </div>
                  <div>
                    <div className="text-sm text-[#7f97a5]">Телефон</div>
                    <div className="text-lg text-[#efebe8] font-medium group-hover:text-[#c9a962] transition-colors">
                      {contacts?.phone || '+7 (495) 629-82-50'}
                    </div>
                  </div>
                </a>

                <a
                  href={`mailto:${contacts?.email || 'vsementsov11@mail.ru'}`}
                  className="flex items-center gap-4 group"
                >
                  <div className="w-12 h-12 bg-[#c9a962]/10 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:bg-[#c9a962]/20 transition-colors">
                    <Mail className="w-5 h-5 text-[#c9a962]" />
                  </div>
                  <div>
                    <div className="text-sm text-[#7f97a5]">Email</div>
                    <div className="text-lg text-[#efebe8] font-medium group-hover:text-[#c9a962] transition-colors">
                      {contacts?.email || 'vsementsov11@mail.ru'}
                    </div>
                  </div>
                </a>

                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-[#c9a962]/10 rounded-xl flex items-center justify-center flex-shrink-0">
                    <MapPin className="w-5 h-5 text-[#c9a962]" />
                  </div>
                  <div>
                    <div className="text-sm text-[#7f97a5]">Адрес</div>
                    <div className="text-base text-[#efebe8]">
                      {contacts?.address || 'г. Москва, ул. Большая Дмитровка, д. 20/5, стр. 2, офис 20'}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-[#c9a962]/10 rounded-xl flex items-center justify-center flex-shrink-0">
                    <Clock className="w-5 h-5 text-[#c9a962]" />
                  </div>
                  <div>
                    <div className="text-sm text-[#7f97a5]">Режим работы</div>
                    <div className="text-base text-[#efebe8]">Круглосуточно</div>
                  </div>
                </div>
              </div>

              {/* Map */}
              <div className="rounded-2xl overflow-hidden border border-[#1e3a51]/50 h-[200px]">
                <iframe
                  src={contacts?.map_url || `https://yandex.ru/map-widget/v1/?ll=${contacts?.lng ?? 37.6136}%2C${contacts?.lat ?? 55.7632}&z=16&pt=${contacts?.lng ?? 37.6136}%2C${contacts?.lat ?? 55.7632}%2Cpm2rdm&lang=ru_RU`}
                  width="100%"
                  height="200"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  title="Офис МКА Семенцов и Партнёры на карте"
                />
              </div>
            </div>
          </AnimateOnScroll>

          {/* Right - form */}
          <AnimateOnScroll animation="fade-right">
            <div className="bg-[#0f2435]/80 backdrop-blur-md rounded-2xl p-8 border border-[#1e3a51]/50">
              <h3
                className="text-2xl font-bold text-[#efebe8] mb-2"
                style={{ fontFamily: "Playfair Display, serif" }}
              >
                Оставить заявку
              </h3>
              <p className="text-sm text-[#7f97a5] mb-6">
                Опишите ситуацию — мы перезвоним в ближайшее время
              </p>

              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label htmlFor="name" className="block text-sm text-[#7f97a5] mb-2">Ваше имя</label>
                  <input
                    type="text"
                    id="name"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full bg-[#1e3a51]/30 border border-[#1e3a51] rounded-xl px-4 py-3.5 sm:py-3 text-base sm:text-sm text-[#efebe8] placeholder-[#8b9caa]/50 focus:border-[#c9a962] focus:outline-none transition-colors duration-300 min-h-[48px]"
                    placeholder="Как к вам обращаться?"
                  />
                </div>

                <div>
                  <label htmlFor="phone" className="block text-sm text-[#7f97a5] mb-2">Телефон</label>
                  <input
                    type="tel"
                    id="phone"
                    required
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full bg-[#1e3a51]/30 border border-[#1e3a51] rounded-xl px-4 py-3.5 sm:py-3 text-base sm:text-sm text-[#efebe8] placeholder-[#8b9caa]/50 focus:border-[#c9a962] focus:outline-none transition-colors duration-300 min-h-[48px]"
                    placeholder="+7 (___) ___-__-__"
                  />
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm text-[#7f97a5] mb-2">Email</label>
                  <input
                    type="email"
                    id="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full bg-[#1e3a51]/30 border border-[#1e3a51] rounded-xl px-4 py-3.5 sm:py-3 text-base sm:text-sm text-[#efebe8] placeholder-[#8b9caa]/50 focus:border-[#c9a962] focus:outline-none transition-colors duration-300 min-h-[48px]"
                    placeholder="email@example.com"
                  />
                </div>

                <div>
                  <label htmlFor="message" className="block text-sm text-[#7f97a5] mb-2">Кратко о ситуации</label>
                  <textarea
                    id="message"
                    rows={3}
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    className="w-full bg-[#1e3a51]/30 border border-[#1e3a51] rounded-xl px-4 py-3.5 sm:py-3 text-base sm:text-sm text-[#efebe8] placeholder-[#8b9caa]/50 focus:border-[#c9a962] focus:outline-none transition-colors duration-300 resize-none"
                    placeholder="Опишите вашу ситуацию..."
                  />
                </div>

                <div className="flex items-start gap-3">
                  <input
                    type="checkbox"
                    id="consent"
                    required
                    checked={formData.consent}
                    onChange={(e) => setFormData({ ...formData, consent: e.target.checked })}
                    className="mt-0.5 w-5 h-5 sm:w-4 sm:h-4 rounded border-[#1e3a51] bg-[#1e3a51]/30 text-[#c9a962] focus:ring-[#c9a962] flex-shrink-0"
                  />
                  <label htmlFor="consent" className="text-sm sm:text-xs text-[#8b9caa]">
                    Даю{" "}
                    <a href="/privacy" className="text-[#c9a962] hover:underline">
                      согласие на обработку персональных данных
                    </a>
                  </label>
                </div>

                {submitStatus === "success" && (
                  <div className="bg-green-900/30 border border-green-500/50 rounded-xl p-4 text-center">
                    <p className="text-green-400 font-medium">Спасибо за обращение!</p>
                    <p className="text-green-400/70 text-sm mt-1">Мы свяжемся с вами в ближайшее время.</p>
                  </div>
                )}

                {submitStatus === "error" && (
                  <div className="bg-red-900/30 border border-red-500/50 rounded-xl p-4 text-center">
                    <p className="text-red-400 font-medium">Ошибка при отправке</p>
                    <p className="text-red-400/70 text-sm mt-1">Позвоните напрямую: {contacts?.phone || '+7 (495) 629-82-50'}</p>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={sending || submitStatus === "success"}
                  className="w-full bg-[#c9a962] hover:bg-[#ddc488] text-[#0b1c2b] font-medium py-4 px-8 rounded-full transition-all duration-300 hover:shadow-lg hover:shadow-[#c9a962]/30 flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Send className="w-5 h-5" />
                  <span>{sending ? "Отправка..." : "Отправить заявку"}</span>
                </button>
              </form>
            </div>
          </AnimateOnScroll>
        </div>
      </div>
    </section>
  );
}
