import { prisma } from "@/lib/db";
import { Users, Briefcase, Newspaper, Tv, Scale, MessageSquare, FileText, Handshake } from "lucide-react";
import Link from "next/link";

export default async function AdminDashboard() {
  const [teamCount, servicesCount, newsCount, mediaCount, practiceCount, messagesCount, docsCount, partnersCount] = await Promise.all([
    prisma.teamMember.count(),
    prisma.service.count(),
    prisma.newsArticle.count(),
    prisma.mediaArticle.count(),
    prisma.practiceCase.count(),
    prisma.contactMessage.count(),
    prisma.document.count(),
    prisma.partner.count(),
  ]);

  const unreadMessages = await prisma.contactMessage.count({ where: { read: false } });

  const stats = [
    { label: "Команда", value: teamCount, icon: Users, href: "/admin/team", color: "text-blue-400" },
    { label: "Услуги", value: servicesCount, icon: Briefcase, href: "/admin/services", color: "text-green-400" },
    { label: "Новости", value: newsCount, icon: Newspaper, href: "/admin/news", color: "text-yellow-400" },
    { label: "СМИ", value: mediaCount, icon: Tv, href: "/admin/media", color: "text-purple-400" },
    { label: "Практика", value: practiceCount, icon: Scale, href: "/admin/practice", color: "text-orange-400" },
    { label: "Партнёры", value: partnersCount, icon: Handshake, href: "/admin/partners", color: "text-cyan-400" },
    { label: "Документы", value: docsCount, icon: FileText, href: "/admin/documents", color: "text-pink-400" },
    { label: "Заявки", value: messagesCount, icon: MessageSquare, href: "/admin/messages", color: "text-red-400", badge: unreadMessages > 0 ? unreadMessages : undefined },
  ];

  return (
    <div>
      <h1 className="text-2xl font-['Playfair_Display'] font-semibold text-[#f5f3f0] mb-6">Дашборд</h1>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {stats.map((s) => (
          <Link
            key={s.href}
            href={s.href}
            className="bg-[#0f2133] border border-[#1e3a51]/30 rounded-xl p-5 hover:border-[#c9a962]/30 transition-all relative"
          >
            <s.icon className={`w-5 h-5 ${s.color} mb-2`} />
            <div className="text-2xl font-bold text-[#f5f3f0]">{s.value}</div>
            <div className="text-xs text-[#8b9caa] mt-0.5">{s.label}</div>
            {s.badge && (
              <span className="absolute top-3 right-3 bg-red-500 text-white text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center">
                {s.badge}
              </span>
            )}
          </Link>
        ))}
      </div>
    </div>
  );
}
