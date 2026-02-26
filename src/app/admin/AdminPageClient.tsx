"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import Hero from "@/components/Hero";
import About from "@/components/About";
import Services from "@/components/Services";
import Team from "@/components/Team";
import Cases from "@/components/Cases";
import ContactForm from "@/components/ContactForm";
import Footer from "@/components/Footer";
import type { TeamMember, Service, CaseItem, AboutData, Advantage, ContactsData, HeroData } from "@/lib/db";

interface AdminUser {
  id: string;
  username: string;
  role: string;
}

interface InitialData {
  team: TeamMember[];
  services: Service[];
  cases: CaseItem[];
  about: AboutData | null;
  advantages: Advantage[];
  contacts: ContactsData | null;
  hero: HeroData | null;
}

interface Props {
  user: AdminUser;
  initialData: InitialData;
}

// ============ Modal wrapper ============
function Modal({ open, onClose, title, children }: { open: boolean; onClose: () => void; title: string; children: React.ReactNode }) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 p-4" onClick={onClose}>
      <div className="bg-[#0f2435] border border-[#1e3a51] rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between p-6 border-b border-[#1e3a51]/50">
          <h2 className="text-xl font-bold text-[#efebe8]" style={{ fontFamily: "Playfair Display, serif" }}>{title}</h2>
          <button onClick={onClose} className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-[#1e3a51] text-[#7f97a5]">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
          </button>
        </div>
        <div className="p-6">{children}</div>
      </div>
    </div>
  );
}

// ============ Form field helpers ============
function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="mb-4">
      <label className="block text-sm text-[#7f97a5] mb-1.5">{label}</label>
      {children}
    </div>
  );
}

const inputClass = "w-full bg-[#1e3a51]/30 border border-[#1e3a51] rounded-xl px-4 py-2.5 text-sm text-[#efebe8] placeholder-[#8b9caa]/50 focus:border-[#c9a962] focus:outline-none transition-colors";
const btnPrimary = "bg-[#c9a962] hover:bg-[#ddc488] text-[#0b1c2b] font-medium py-2.5 px-6 rounded-full transition-all text-sm";
const btnDanger = "bg-red-600 hover:bg-red-700 text-white font-medium py-2.5 px-6 rounded-full transition-all text-sm";

export default function AdminPageClient({ user, initialData }: Props) {
  const router = useRouter();
  const [data, setData] = useState(initialData);

  // Modal state
  const [modal, setModal] = useState<{ type: string; payload?: unknown } | null>(null);

  const refreshData = useCallback(async () => {
    const [teamR, servicesR, casesR, aboutR, contactsR, heroR] = await Promise.all([
      fetch("/api/team").then(r => r.json()),
      fetch("/api/services").then(r => r.json()),
      fetch("/api/cases").then(r => r.json()),
      fetch("/api/about").then(r => r.json()),
      fetch("/api/contacts").then(r => r.json()),
      fetch("/api/hero").then(r => r.json()),
    ]);
    setData({
      team: teamR,
      services: servicesR,
      cases: casesR,
      about: aboutR.about,
      advantages: aboutR.advantages,
      contacts: contactsR,
      hero: heroR,
    });
  }, []);

  const handleLogout = () => {
    document.cookie = "admin_token=; path=/; max-age=0";
    router.push("/admin/login");
  };

  // ============ Team handlers ============
  const [teamForm, setTeamForm] = useState<Partial<TeamMember>>({});
  const [teamPhoto, setTeamPhoto] = useState<File | null>(null);

  const openTeamEdit = (member: TeamMember) => {
    setTeamForm({ ...member });
    setTeamPhoto(null);
    setModal({ type: "team-edit", payload: member });
  };

  const openTeamAdd = () => {
    setTeamForm({ name: "", role: "", short_bio: "", full_bio: "", link: "" });
    setTeamPhoto(null);
    setModal({ type: "team-add" });
  };

  const saveTeam = async () => {
    const isNew = modal?.type === "team-add";
    const method = isNew ? "POST" : "PUT";
    const res = await fetch("/api/team", {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(teamForm),
    });
    if (!res.ok) { alert("Ошибка сохранения"); return; }
    const saved = await res.json();
    const memberId = isNew ? saved.id : teamForm.id;

    if (teamPhoto && memberId) {
      const fd = new FormData();
      fd.append("file", teamPhoto);
      fd.append("memberId", memberId);
      await fetch("/api/team/upload", { method: "POST", body: fd });
    }

    await refreshData();
    setModal(null);
  };

  const deleteTeam = async (member: TeamMember) => {
    if (!confirm(`Удалить адвоката ${member.name}?`)) return;
    await fetch("/api/team", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: member.id }),
    });
    await refreshData();
  };

  // ============ Service handlers ============
  const [serviceForm, setServiceForm] = useState<Partial<Service>>({});

  const openServiceEdit = (s: Service) => {
    setServiceForm({ ...s });
    setModal({ type: "service-edit" });
  };

  const openServiceAdd = (category: string) => {
    setServiceForm({ category, icon: "Scale", title: "", description: "" });
    setModal({ type: "service-add" });
  };

  const saveService = async () => {
    const isNew = modal?.type === "service-add";
    const res = await fetch("/api/services", {
      method: isNew ? "POST" : "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(serviceForm),
    });
    if (!res.ok) { alert("Ошибка сохранения"); return; }
    await refreshData();
    setModal(null);
  };

  const deleteService = async (s: Service) => {
    if (!confirm(`Удалить услугу "${s.title}"?`)) return;
    await fetch("/api/services", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: s.id }),
    });
    await refreshData();
  };

  // ============ Case handlers ============
  const [caseForm, setCaseForm] = useState<{ id?: string; icon?: string; title?: string; category?: string | null; description?: string | null; sort_order?: number; links?: { text: string; url: string }[] }>({});

  const openCaseEdit = (c: CaseItem) => {
    setCaseForm({ ...c, links: c.links || [] });
    setModal({ type: "case-edit" });
  };

  const openCaseAdd = () => {
    setCaseForm({ icon: "Scale", title: "", category: "", description: "", links: [] });
    setModal({ type: "case-add" });
  };

  const saveCase = async () => {
    const isNew = modal?.type === "case-add";
    const res = await fetch("/api/cases", {
      method: isNew ? "POST" : "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(caseForm),
    });
    if (!res.ok) { alert("Ошибка сохранения"); return; }
    await refreshData();
    setModal(null);
  };

  const deleteCase = async (c: CaseItem) => {
    if (!confirm(`Удалить кейс "${c.title}"?`)) return;
    await fetch("/api/cases", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: c.id }),
    });
    await refreshData();
  };

  // ============ About handlers ============
  const [aboutForm, setAboutForm] = useState<{ text1: string; text2: string }>({ text1: "", text2: "" });

  const openAboutEdit = () => {
    setAboutForm({ text1: data.about?.text1 || "", text2: data.about?.text2 || "" });
    setModal({ type: "about-edit" });
  };

  const saveAbout = async () => {
    await fetch("/api/about", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ about: aboutForm }),
    });
    await refreshData();
    setModal(null);
  };

  // ============ Hero handlers ============
  const [heroForm, setHeroForm] = useState<Partial<HeroData>>({});

  const openHeroEdit = () => {
    setHeroForm({ ...data.hero });
    setModal({ type: "hero-edit" });
  };

  const saveHero = async () => {
    await fetch("/api/hero", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(heroForm),
    });
    await refreshData();
    setModal(null);
  };

  // ============ Change password handlers ============
  const [passwordForm, setPasswordForm] = useState({ currentPassword: "", newPassword: "", confirmPassword: "" });
  const [passwordError, setPasswordError] = useState("");
  const [passwordSuccess, setPasswordSuccess] = useState("");

  const openPasswordChange = () => {
    setPasswordForm({ currentPassword: "", newPassword: "", confirmPassword: "" });
    setPasswordError("");
    setPasswordSuccess("");
    setModal({ type: "change-password" });
  };

  const savePassword = async () => {
    setPasswordError("");
    setPasswordSuccess("");
    if (!passwordForm.currentPassword || !passwordForm.newPassword) {
      setPasswordError("Заполните все поля");
      return;
    }
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setPasswordError("Новый пароль и подтверждение не совпадают");
      return;
    }
    if (passwordForm.newPassword.length < 4) {
      setPasswordError("Новый пароль должен быть не менее 4 символов");
      return;
    }
    const res = await fetch("/api/auth/change-password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ currentPassword: passwordForm.currentPassword, newPassword: passwordForm.newPassword }),
    });
    if (res.ok) {
      setPasswordSuccess("Пароль успешно изменён");
      setTimeout(() => setModal(null), 1500);
    } else {
      const data = await res.json();
      setPasswordError(data.error || "Ошибка");
    }
  };

  // ============ Contacts handlers ============
  const [contactsForm, setContactsForm] = useState<Partial<ContactsData>>({});

  const openContactsEdit = () => {
    setContactsForm({ ...data.contacts });
    setModal({ type: "contacts-edit" });
  };

  const saveContacts = async () => {
    await fetch("/api/contacts", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(contactsForm),
    });
    await refreshData();
    setModal(null);
  };

  return (
    <div className="min-h-screen">
      {/* Admin Toolbar */}
      <div className="fixed top-0 left-0 right-0 z-[90] bg-[#0b1c2b]/95 backdrop-blur-md border-b border-[#c9a962]/30">
        <div className="max-w-7xl mx-auto px-4 md:px-8 h-14 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <span className="text-[#c9a962] font-bold text-sm" style={{ fontFamily: "Playfair Display, serif" }}>
              АДМИН-ПАНЕЛЬ
            </span>
            <nav className="hidden md:flex items-center gap-3">
              {[
                { href: "#hero", label: "Hero" },
                { href: "#about", label: "О коллегии" },
                { href: "#services", label: "Услуги" },
                { href: "#team", label: "Команда" },
                { href: "#cases", label: "Кейсы" },
                { href: "#contacts", label: "Контакты" },
              ].map(item => (
                <a key={item.href} href={item.href} className="text-xs text-[#7f97a5] hover:text-[#efebe8] transition-colors px-2 py-1 rounded">
                  {item.label}
                </a>
              ))}
            </nav>
          </div>
          <div className="flex items-center gap-3">
            {user.role === "superadmin" && (
              <a href="/admin/users" className="text-xs text-[#c9a962] hover:text-[#ddc488] transition-colors font-medium">
                Пользователи
              </a>
            )}
            <span className="text-xs text-[#7f97a5]">{user.username}</span>
            <button onClick={openPasswordChange} className="text-xs text-[#7f97a5] hover:text-[#efebe8] transition-colors">
              Сменить пароль
            </button>
            <button onClick={handleLogout} className="text-xs text-red-400 hover:text-red-300 transition-colors">
              Выйти
            </button>
          </div>
        </div>
      </div>

      {/* Site sections with edit mode */}
      <div className="pt-14">
        {/* Hero section with edit overlay */}
        <div className="relative group/hero">
          <Hero hero={data.hero} contacts={data.contacts} />
          <div className="absolute top-4 right-4 z-20 opacity-100 md:opacity-0 md:group-hover/hero:opacity-100 transition-opacity">
            <button onClick={openHeroEdit} className="bg-[#c9a962] hover:bg-[#ddc488] text-[#0b1c2b] rounded-lg px-3 py-2 text-xs font-medium flex items-center gap-1.5 shadow-lg">
              <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"/></svg>
              Редактировать Hero
            </button>
          </div>
        </div>

        <About about={data.about} advantages={data.advantages} editable onEditAbout={openAboutEdit} />
        <Services services={data.services} editable onEdit={openServiceEdit} onDelete={deleteService} onAdd={openServiceAdd} />
        <Team members={data.team} editable onEdit={openTeamEdit} onDelete={deleteTeam} onAdd={openTeamAdd} />
        <Cases cases={data.cases} editable onEdit={openCaseEdit} onDelete={deleteCase} onAdd={openCaseAdd} />

        {/* Contacts with edit overlay */}
        <div className="relative group/contacts">
          <ContactForm contacts={data.contacts} />
          <div className="absolute top-4 right-4 z-20 opacity-100 md:opacity-0 md:group-hover/contacts:opacity-100 transition-opacity">
            <button onClick={openContactsEdit} className="bg-[#c9a962] hover:bg-[#ddc488] text-[#0b1c2b] rounded-lg px-3 py-2 text-xs font-medium flex items-center gap-1.5 shadow-lg">
              <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"/></svg>
              Редактировать контакты
            </button>
          </div>
        </div>

        <Footer contacts={data.contacts} />
      </div>

      {/* ============ MODALS ============ */}

      {/* Team Edit/Add Modal */}
      <Modal
        open={modal?.type === "team-edit" || modal?.type === "team-add"}
        onClose={() => setModal(null)}
        title={modal?.type === "team-add" ? "Добавить адвоката" : "Редактировать адвоката"}
      >
        <Field label="ФИО">
          <input className={inputClass} value={teamForm.name || ""} onChange={e => setTeamForm(f => ({ ...f, name: e.target.value }))} />
        </Field>
        <Field label="Должность">
          <input className={inputClass} value={teamForm.role || ""} onChange={e => setTeamForm(f => ({ ...f, role: e.target.value }))} />
        </Field>
        <Field label="Краткое био">
          <textarea className={inputClass} rows={2} value={teamForm.short_bio || ""} onChange={e => setTeamForm(f => ({ ...f, short_bio: e.target.value }))} />
        </Field>
        <Field label="Полное био">
          <textarea className={inputClass} rows={4} value={teamForm.full_bio || ""} onChange={e => setTeamForm(f => ({ ...f, full_bio: e.target.value }))} />
        </Field>
        <Field label="Ссылка (необязательно)">
          <input className={inputClass} value={teamForm.link || ""} onChange={e => setTeamForm(f => ({ ...f, link: e.target.value }))} placeholder="https://..." />
        </Field>
        <Field label="Фото">
          <div className="flex items-center gap-4">
            {(teamForm.photo || teamPhoto) && (
              <div className="w-16 h-16 rounded-lg overflow-hidden bg-[#1e3a51]/40 flex-shrink-0">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={teamPhoto ? URL.createObjectURL(teamPhoto) : (teamForm.photo || "")}
                  alt="preview"
                  className="w-full h-full object-cover"
                />
              </div>
            )}
            <input
              type="file"
              accept="image/jpeg,image/png,image/webp"
              onChange={e => setTeamPhoto(e.target.files?.[0] || null)}
              className="text-sm text-[#7f97a5] file:mr-3 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:bg-[#c9a962]/20 file:text-[#c9a962] hover:file:bg-[#c9a962]/30"
            />
          </div>
        </Field>
        <div className="flex gap-3 mt-6">
          <button onClick={saveTeam} className={btnPrimary}>Сохранить</button>
          <button onClick={() => setModal(null)} className="text-sm text-[#7f97a5] hover:text-[#efebe8]">Отмена</button>
        </div>
      </Modal>

      {/* Service Edit/Add Modal */}
      <Modal
        open={modal?.type === "service-edit" || modal?.type === "service-add"}
        onClose={() => setModal(null)}
        title={modal?.type === "service-add" ? "Добавить услугу" : "Редактировать услугу"}
      >
        <Field label="Название">
          <input className={inputClass} value={serviceForm.title || ""} onChange={e => setServiceForm(f => ({ ...f, title: e.target.value }))} />
        </Field>
        <Field label="Описание">
          <textarea className={inputClass} rows={3} value={serviceForm.description || ""} onChange={e => setServiceForm(f => ({ ...f, description: e.target.value }))} />
        </Field>
        <Field label="Категория">
          <select className={inputClass} value={serviceForm.category || "business"} onChange={e => setServiceForm(f => ({ ...f, category: e.target.value }))}>
            <option value="business">Для бизнеса</option>
            <option value="personal">Для граждан</option>
          </select>
        </Field>
        <Field label="Иконка (Lucide)">
          <select className={inputClass} value={serviceForm.icon || "Scale"} onChange={e => setServiceForm(f => ({ ...f, icon: e.target.value }))}>
            {["Scale","Gavel","Shield","Banknote","FileText","Building2","ScrollText","UserCheck","HandshakeIcon","Briefcase","Home","Heart","Landmark","Users","Wheat"].map(i => (
              <option key={i} value={i}>{i}</option>
            ))}
          </select>
        </Field>
        <div className="flex gap-3 mt-6">
          <button onClick={saveService} className={btnPrimary}>Сохранить</button>
          <button onClick={() => setModal(null)} className="text-sm text-[#7f97a5] hover:text-[#efebe8]">Отмена</button>
        </div>
      </Modal>

      {/* Case Edit/Add Modal */}
      <Modal
        open={modal?.type === "case-edit" || modal?.type === "case-add"}
        onClose={() => setModal(null)}
        title={modal?.type === "case-add" ? "Добавить кейс" : "Редактировать кейс"}
      >
        <Field label="Название">
          <input className={inputClass} value={caseForm.title || ""} onChange={e => setCaseForm(f => ({ ...f, title: e.target.value }))} />
        </Field>
        <Field label="Категория">
          <input className={inputClass} value={caseForm.category || ""} onChange={e => setCaseForm(f => ({ ...f, category: e.target.value }))} />
        </Field>
        <Field label="Описание">
          <textarea className={inputClass} rows={4} value={caseForm.description || ""} onChange={e => setCaseForm(f => ({ ...f, description: e.target.value }))} />
        </Field>
        <Field label="Иконка">
          <select className={inputClass} value={caseForm.icon || "Scale"} onChange={e => setCaseForm(f => ({ ...f, icon: e.target.value }))}>
            {["Scale","Gavel","Tv","BookOpen"].map(i => (
              <option key={i} value={i}>{i}</option>
            ))}
          </select>
        </Field>
        <Field label="Ссылки">
          {(caseForm.links || []).map((link, idx) => (
            <div key={idx} className="flex gap-2 mb-2">
              <input className={inputClass + " flex-1"} placeholder="Текст" value={link.text} onChange={e => {
                const links = [...(caseForm.links || [])];
                links[idx] = { ...links[idx], text: e.target.value };
                setCaseForm(f => ({ ...f, links }));
              }} />
              <input className={inputClass + " flex-1"} placeholder="URL" value={link.url} onChange={e => {
                const links = [...(caseForm.links || [])];
                links[idx] = { ...links[idx], url: e.target.value };
                setCaseForm(f => ({ ...f, links }));
              }} />
              <button onClick={() => {
                const links = (caseForm.links || []).filter((_, i) => i !== idx);
                setCaseForm(f => ({ ...f, links }));
              }} className="text-red-400 hover:text-red-300 px-2">✕</button>
            </div>
          ))}
          <button onClick={() => setCaseForm(f => ({ ...f, links: [...(f.links || []), { text: "", url: "" }] }))} className="text-[#c9a962] text-sm hover:text-[#ddc488]">+ Добавить ссылку</button>
        </Field>
        <div className="flex gap-3 mt-6">
          <button onClick={saveCase} className={btnPrimary}>Сохранить</button>
          <button onClick={() => setModal(null)} className="text-sm text-[#7f97a5] hover:text-[#efebe8]">Отмена</button>
        </div>
      </Modal>

      {/* About Edit Modal */}
      <Modal open={modal?.type === "about-edit"} onClose={() => setModal(null)} title="Редактировать «О коллегии»">
        <Field label="Первый абзац">
          <textarea className={inputClass} rows={4} value={aboutForm.text1} onChange={e => setAboutForm(f => ({ ...f, text1: e.target.value }))} />
        </Field>
        <Field label="Второй абзац">
          <textarea className={inputClass} rows={4} value={aboutForm.text2} onChange={e => setAboutForm(f => ({ ...f, text2: e.target.value }))} />
        </Field>
        <div className="flex gap-3 mt-6">
          <button onClick={saveAbout} className={btnPrimary}>Сохранить</button>
          <button onClick={() => setModal(null)} className="text-sm text-[#7f97a5] hover:text-[#efebe8]">Отмена</button>
        </div>
      </Modal>

      {/* Hero Edit Modal */}
      <Modal open={modal?.type === "hero-edit"} onClose={() => setModal(null)} title="Редактировать Hero-секцию">
        <Field label="Подзаголовок">
          <input className={inputClass} value={heroForm.subtitle || ""} onChange={e => setHeroForm(f => ({ ...f, subtitle: e.target.value }))} />
        </Field>
        <Field label="Заголовок">
          <input className={inputClass} value={heroForm.title || ""} onChange={e => setHeroForm(f => ({ ...f, title: e.target.value }))} />
        </Field>
        <Field label="Описание">
          <textarea className={inputClass} rows={3} value={heroForm.description || ""} onChange={e => setHeroForm(f => ({ ...f, description: e.target.value }))} />
        </Field>
        <div className="grid grid-cols-2 gap-4">
          <Field label="Стат 1: значение">
            <input type="number" className={inputClass} value={heroForm.stat1_value ?? ""} onChange={e => setHeroForm(f => ({ ...f, stat1_value: parseInt(e.target.value) || 0 }))} />
          </Field>
          <Field label="Стат 1: подпись">
            <input className={inputClass} value={heroForm.stat1_label || ""} onChange={e => setHeroForm(f => ({ ...f, stat1_label: e.target.value }))} />
          </Field>
          <Field label="Стат 2: значение">
            <input type="number" className={inputClass} value={heroForm.stat2_value ?? ""} onChange={e => setHeroForm(f => ({ ...f, stat2_value: parseInt(e.target.value) || 0 }))} />
          </Field>
          <Field label="Стат 2: подпись">
            <input className={inputClass} value={heroForm.stat2_label || ""} onChange={e => setHeroForm(f => ({ ...f, stat2_label: e.target.value }))} />
          </Field>
          <Field label="Стат 3: значение">
            <input type="number" className={inputClass} value={heroForm.stat3_value ?? ""} onChange={e => setHeroForm(f => ({ ...f, stat3_value: parseInt(e.target.value) || 0 }))} />
          </Field>
          <Field label="Стат 3: подпись">
            <input className={inputClass} value={heroForm.stat3_label || ""} onChange={e => setHeroForm(f => ({ ...f, stat3_label: e.target.value }))} />
          </Field>
        </div>
        <div className="flex gap-3 mt-6">
          <button onClick={saveHero} className={btnPrimary}>Сохранить</button>
          <button onClick={() => setModal(null)} className="text-sm text-[#7f97a5] hover:text-[#efebe8]">Отмена</button>
        </div>
      </Modal>

      {/* Change Password Modal */}
      <Modal open={modal?.type === "change-password"} onClose={() => setModal(null)} title="Сменить пароль">
        <Field label="Текущий пароль">
          <input type="password" className={inputClass} value={passwordForm.currentPassword} onChange={e => setPasswordForm(f => ({ ...f, currentPassword: e.target.value }))} />
        </Field>
        <Field label="Новый пароль">
          <input type="password" className={inputClass} value={passwordForm.newPassword} onChange={e => setPasswordForm(f => ({ ...f, newPassword: e.target.value }))} />
        </Field>
        <Field label="Подтвердите новый пароль">
          <input type="password" className={inputClass} value={passwordForm.confirmPassword} onChange={e => setPasswordForm(f => ({ ...f, confirmPassword: e.target.value }))} />
        </Field>
        {passwordError && <p className="text-red-400 text-sm mb-3">{passwordError}</p>}
        {passwordSuccess && <p className="text-green-400 text-sm mb-3">{passwordSuccess}</p>}
        <div className="flex gap-3 mt-6">
          <button onClick={savePassword} className={btnPrimary}>Сохранить</button>
          <button onClick={() => setModal(null)} className="text-sm text-[#7f97a5] hover:text-[#efebe8]">Отмена</button>
        </div>
      </Modal>

      {/* Contacts Edit Modal */}
      <Modal open={modal?.type === "contacts-edit"} onClose={() => setModal(null)} title="Редактировать контакты">
        <Field label="Телефон">
          <input className={inputClass} value={contactsForm.phone || ""} onChange={e => setContactsForm(f => ({ ...f, phone: e.target.value }))} />
        </Field>
        <Field label="Email">
          <input className={inputClass} value={contactsForm.email || ""} onChange={e => setContactsForm(f => ({ ...f, email: e.target.value }))} />
        </Field>
        <Field label="Адрес">
          <textarea className={inputClass} rows={2} value={contactsForm.address || ""} onChange={e => setContactsForm(f => ({ ...f, address: e.target.value }))} />
        </Field>
        <Field label="URL карты (Yandex iframe)">
          <input className={inputClass} value={contactsForm.map_url || ""} onChange={e => setContactsForm(f => ({ ...f, map_url: e.target.value }))} />
        </Field>
        <div className="grid grid-cols-2 gap-4">
          <Field label="Широта">
            <input type="number" step="any" className={inputClass} value={contactsForm.lat ?? ""} onChange={e => setContactsForm(f => ({ ...f, lat: parseFloat(e.target.value) || 0 }))} />
          </Field>
          <Field label="Долгота">
            <input type="number" step="any" className={inputClass} value={contactsForm.lng ?? ""} onChange={e => setContactsForm(f => ({ ...f, lng: parseFloat(e.target.value) || 0 }))} />
          </Field>
        </div>
        <div className="flex gap-3 mt-6">
          <button onClick={saveContacts} className={btnPrimary}>Сохранить</button>
          <button onClick={() => setModal(null)} className="text-sm text-[#7f97a5] hover:text-[#efebe8]">Отмена</button>
        </div>
      </Modal>
    </div>
  );
}
