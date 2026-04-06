"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import {
  Users,
  Briefcase,
  Newspaper,
  Tv,
  Scale,
  Handshake,
  FileText,
  BookOpen,
  MessageSquare,
  LayoutDashboard,
  LogOut,
  Menu,
  X,
  Share2,
} from "lucide-react";

const navItems = [
  { href: "/admin", icon: LayoutDashboard, label: "Дашборд" },
  { href: "/admin/team", icon: Users, label: "Команда" },
  { href: "/admin/services", icon: Briefcase, label: "Услуги" },
  { href: "/admin/news", icon: Newspaper, label: "Новости" },
  { href: "/admin/media", icon: Tv, label: "СМИ" },
  { href: "/admin/practice", icon: Scale, label: "Практика" },
  { href: "/admin/partners", icon: Handshake, label: "Партнёры" },
  { href: "/admin/documents", icon: FileText, label: "Образцы док." },
  { href: "/admin/publications", icon: BookOpen, label: "Публикации" },
  { href: "/admin/pages", icon: FileText, label: "Страницы" },
  { href: "/admin/social", icon: Share2, label: "Соцсети" },
  { href: "/admin/messages", icon: MessageSquare, label: "Заявки" },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [auth, setAuth] = useState<boolean | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (pathname === "/admin/login") {
      setAuth(false);
      return;
    }
    fetch("/api/auth")
      .then((r) => {
        if (r.ok) setAuth(true);
        else {
          setAuth(false);
          router.push("/admin/login");
        }
      })
      .catch(() => {
        setAuth(false);
        router.push("/admin/login");
      });
  }, [pathname, router]);

  if (pathname === "/admin/login") {
    return <>{children}</>;
  }

  if (auth === null) {
    return (
      <div className="min-h-screen bg-[#0b1c2b] flex items-center justify-center">
        <div className="text-[#c9a962]">Загрузка...</div>
      </div>
    );
  }

  if (!auth) return null;

  const handleLogout = async () => {
    await fetch("/api/auth", { method: "DELETE" });
    router.push("/admin/login");
  };

  return (
    <div className="min-h-screen bg-[#0a1525] flex">
      {/* Sidebar */}
      <aside className={`fixed inset-y-0 left-0 z-50 w-64 bg-[#0b1c2b] border-r border-[#1e3a51]/30 transform transition-transform lg:translate-x-0 ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}`}>
        <div className="flex items-center justify-between h-16 px-4 border-b border-[#1e3a51]/30">
          <Link href="/admin" className="text-[#c9a962] font-['Playfair_Display'] font-semibold">
            Админ-панель
          </Link>
          <button onClick={() => setSidebarOpen(false)} className="lg:hidden text-[#8b9caa]">
            <X className="w-5 h-5" />
          </button>
        </div>
        <nav className="p-3 space-y-1 overflow-y-auto h-[calc(100vh-8rem)]">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setSidebarOpen(false)}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors ${
                pathname === item.href
                  ? "bg-[#c9a962]/10 text-[#c9a962]"
                  : "text-[#8b9caa] hover:text-[#f5f3f0] hover:bg-[#1e3a51]/30"
              }`}
            >
              <item.icon className="w-4 h-4" />
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="absolute bottom-0 left-0 right-0 p-3 border-t border-[#1e3a51]/30">
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-[#8b9caa] hover:text-red-400 hover:bg-red-400/10 transition-colors w-full"
          >
            <LogOut className="w-4 h-4" />
            Выйти
          </button>
        </div>
      </aside>

      {/* Main */}
      <div className="flex-1 lg:ml-64">
        <header className="sticky top-0 z-40 h-16 bg-[#0b1c2b]/95 backdrop-blur border-b border-[#1e3a51]/30 flex items-center px-4 gap-4">
          <button onClick={() => setSidebarOpen(true)} className="lg:hidden text-[#8b9caa]">
            <Menu className="w-5 h-5" />
          </button>
          <div className="text-sm text-[#8b9caa]">
            МКА «Семенцов и Партнёры»
          </div>
          <Link href="/" className="ml-auto text-xs text-[#5a6f80] hover:text-[#c9a962] transition-colors">
            ← На сайт
          </Link>
        </header>
        <main className="p-4 md:p-6 lg:p-8">
          {children}
        </main>
      </div>

      {/* Overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 bg-black/50 z-40 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}
    </div>
  );
}
