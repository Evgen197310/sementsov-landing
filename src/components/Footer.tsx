"use client";

import { useState, useCallback } from "react";
import Link from "next/link";
import { Phone, Mail, MapPin, Send } from "lucide-react";

export function Footer() {
  const [form, setForm] = useState({ name: "", email: "", phone: "", service: "", message: "" });
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [errors, setErrors] = useState<{ email?: string; phone?: string }>({});

  const formatPhone = useCallback((value: string) => {
    const digits = value.replace(/\D/g, "");
    const d = digits.startsWith("7") ? digits : digits.startsWith("8") ? "7" + digits.slice(1) : "7" + digits;
    let result = "+7";
    if (d.length > 1) result += " (" + d.slice(1, 4);
    if (d.length >= 4) result += ") ";
    if (d.length > 4) result += d.slice(4, 7);
    if (d.length > 7) result += "-" + d.slice(7, 9);
    if (d.length > 9) result += "-" + d.slice(9, 11);
    return result;
  }, []);

  const handlePhoneChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value;
    if (raw === "" || raw === "+") {
      setForm(f => ({ ...f, phone: "" }));
      setErrors(er => ({ ...er, phone: undefined }));
      return;
    }
    const formatted = formatPhone(raw);
    setForm(f => ({ ...f, phone: formatted }));
    const digitCount = formatted.replace(/\D/g, "").length;
    if (digitCount > 0 && digitCount < 11) {
      setErrors(er => ({ ...er, phone: "Введите полный номер" }));
    } else {
      setErrors(er => ({ ...er, phone: undefined }));
    }
  }, [formatPhone]);

  const validateEmail = useCallback((email: string) => {
    if (!email) return undefined;
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
    return re.test(email) ? undefined : "Некорректный email";
  }, []);

  const handleEmailChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setForm(f => ({ ...f, email: val }));
    setErrors(er => ({ ...er, email: validateEmail(val) }));
  }, [validateEmail]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const emailErr = validateEmail(form.email);
    const phoneDigits = form.phone.replace(/\D/g, "").length;
    const phoneErr = form.phone && phoneDigits < 11 ? "Введите полный номер" : undefined;
    if (emailErr || phoneErr) {
      setErrors({ email: emailErr, phone: phoneErr });
      return;
    }
    setStatus("sending");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (res.ok) {
        setStatus("sent");
        setForm({ name: "", email: "", phone: "", service: "", message: "" });
      } else {
        setStatus("error");
      }
    } catch {
      setStatus("error");
    }
  };

  return (
    <footer className="bg-[#071420] border-t border-[#1e3a51]/30">
      {/* Contact form section */}
      <div className="container mx-auto px-4 py-16">
        <div className="grid lg:grid-cols-2 gap-12 max-w-6xl mx-auto">
          {/* Form */}
          <div>
            <p className="text-2xl font-['Playfair_Display'] font-semibold text-[#f5f3f0] mb-2">
              Написать нам
            </p>
            <p className="text-[#8b9caa] mb-6 text-sm">
              Заполните форму и мы свяжемся с вами в ближайшее время
            </p>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid sm:grid-cols-2 gap-4">
                <input
                  type="text"
                  placeholder="Ваше имя *"
                  required
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="bg-[#0f2133] border border-[#1e3a51]/50 rounded-lg px-4 py-3 text-sm text-[#f5f3f0] placeholder:text-[#5a6f80] focus:border-[#c9a962] focus:outline-none transition-colors"
                />
                <div>
                  <input
                    type="email"
                    placeholder="Ваш Email *"
                    required
                    value={form.email}
                    onChange={handleEmailChange}
                    className={`w-full bg-[#0f2133] border ${errors.email ? "border-red-500" : "border-[#1e3a51]/50"} rounded-lg px-4 py-3 text-sm text-[#f5f3f0] placeholder:text-[#5a6f80] focus:border-[#c9a962] focus:outline-none transition-colors`}
                  />
                  {errors.email && <p className="text-red-400 text-xs mt-1">{errors.email}</p>}
                </div>
              </div>
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <input
                    type="tel"
                    placeholder="+7 (___) ___-__-__"
                    value={form.phone}
                    onChange={handlePhoneChange}
                    className={`w-full bg-[#0f2133] border ${errors.phone ? "border-red-500" : "border-[#1e3a51]/50"} rounded-lg px-4 py-3 text-sm text-[#f5f3f0] placeholder:text-[#5a6f80] focus:border-[#c9a962] focus:outline-none transition-colors`}
                  />
                  {errors.phone && <p className="text-red-400 text-xs mt-1">{errors.phone}</p>}
                </div>
                <select
                  value={form.service}
                  onChange={(e) => setForm({ ...form, service: e.target.value })}
                  className="bg-[#0f2133] border border-[#1e3a51]/50 rounded-lg px-4 py-3 text-sm text-[#5a6f80] focus:border-[#c9a962] focus:outline-none transition-colors"
                >
                  <option value="">Тип услуги</option>
                  <option value="consultation">Консультация</option>
                  <option value="criminal">Уголовное право</option>
                  <option value="civil">Гражданское право</option>
                  <option value="corporate">Корпоративное право</option>
                  <option value="arbitration">Арбитраж</option>
                  <option value="mediation">Медиация</option>
                  <option value="other">Другое</option>
                </select>
              </div>
              <textarea
                placeholder="Ваше сообщение *"
                required
                rows={4}
                value={form.message}
                onChange={(e) => setForm({ ...form, message: e.target.value })}
                className="w-full bg-[#0f2133] border border-[#1e3a51]/50 rounded-lg px-4 py-3 text-sm text-[#f5f3f0] placeholder:text-[#5a6f80] focus:border-[#c9a962] focus:outline-none transition-colors resize-none"
              />
              <button
                type="submit"
                disabled={status === "sending"}
                className="btn-primary flex items-center gap-2"
              >
                <Send className="w-4 h-4" />
                {status === "sending" ? "Отправка..." : "Отправить"}
              </button>
              {status === "sent" && (
                <p className="text-green-400 text-sm">Сообщение отправлено! Мы свяжемся с вами.</p>
              )}
              {status === "error" && (
                <p className="text-red-400 text-sm">Ошибка отправки. Попробуйте ещё раз.</p>
              )}
            </form>
          </div>

          {/* Contact info */}
          <div className="lg:pl-8">
            <p className="text-2xl font-['Playfair_Display'] font-semibold text-[#f5f3f0] mb-6">
              Контакты
            </p>
            <div className="space-y-5">
              <div className="flex gap-4">
                <MapPin className="w-5 h-5 text-[#c9a962] flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-[#f5f3f0] text-sm font-medium">Адрес</p>
                  <p className="text-[#8b9caa] text-sm">
                    107031 Москва, ул. Большая Дмитровка<br />
                    д.20/5, строение 2, офис 20
                  </p>
                </div>
              </div>
              <div className="flex gap-4">
                <Phone className="w-5 h-5 text-[#c9a962] flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-[#f5f3f0] text-sm font-medium">Телефон</p>
                  <a href="tel:+74956298250" className="text-[#8b9caa] text-sm hover:text-[#c9a962] transition-colors">
                    +7 (495) 629 82 50
                  </a>
                  <p className="text-[#5a6f80] text-xs mt-0.5">Круглосуточно</p>
                </div>
              </div>
              <div className="flex gap-4">
                <Mail className="w-5 h-5 text-[#c9a962] flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-[#f5f3f0] text-sm font-medium">Email</p>
                  <a href="mailto:vsementsov11@mail.ru" className="text-[#8b9caa] text-sm hover:text-[#c9a962] transition-colors">
                    vsementsov11@mail.ru
                  </a>
                </div>
              </div>
            </div>

            <div className="mt-8 p-5 bg-[#0f2133] rounded-xl border border-[#1e3a51]/30">
              <p className="text-[#c9a962] font-medium text-sm mb-1">Бесплатная консультация</p>
              <p className="text-[#8b9caa] text-sm">
                Позвоните нам или оставьте заявку — мы ответим в течение часа
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom nav */}
      <div className="border-t border-[#1e3a51]/20">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-xs text-[#5a6f80]">
              <Link href="/about" className="hover:text-[#8b9caa] transition-colors">О коллегии</Link>
              <Link href="/services/individuals" className="hover:text-[#8b9caa] transition-colors">Услуги физ. лицам</Link>
              <Link href="/services/legal" className="hover:text-[#8b9caa] transition-colors">Услуги юр. лицам</Link>
              <Link href="/team" className="hover:text-[#8b9caa] transition-colors">Команда</Link>
              <Link href="/practice" className="hover:text-[#8b9caa] transition-colors">Практика</Link>
              <Link href="/media/news" className="hover:text-[#8b9caa] transition-colors">Новости</Link>
              <Link href="/documents" className="hover:text-[#8b9caa] transition-colors">Документы</Link>
              <Link href="/partners" className="hover:text-[#8b9caa] transition-colors">Партнёры</Link>
              <Link href="/career" className="hover:text-[#8b9caa] transition-colors">Карьера</Link>
              <Link href="/contacts" className="hover:text-[#8b9caa] transition-colors">Контакты</Link>
            </div>
            <p className="text-xs text-[#3d4f5f]">
              &copy; {new Date().getFullYear()} МКА «Семенцов и Партнёры»
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
