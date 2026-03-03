import Link from "next/link";
import Image from "next/image";
import { prisma } from "@/lib/db";
import { Globe } from "lucide-react";

export const metadata = { title: "Наша команда — МКА «Семенцов и Партнёры»" };

export default async function TeamPage() {
  const team = await prisma.teamMember.findMany({ orderBy: { order: "asc" } });

  return (
    <>
      <section className="bg-gradient-to-b from-[#071420] to-[#0b1c2b] py-16 md:py-24">
        <div className="container mx-auto px-4 max-w-6xl">
          <h1 className="text-3xl md:text-5xl font-['Playfair_Display'] font-bold text-[#f5f3f0] mb-4">
            Наша команда
          </h1>
          <div className="decorative-line mb-6" />
          <p className="text-[#8b9caa] max-w-2xl">
            Опытные адвокаты с многолетним стажем работы в органах прокуратуры, следствия и суда
          </p>
        </div>
      </section>

      <section className="section-padding">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {team.map((member) => (
              <Link
                key={member.id}
                href={`/team/${member.slug}`}
                className="bg-[#0f2133] border border-[#1e3a51]/30 rounded-xl p-6 hover:border-[#c9a962]/30 transition-all card-enhanced group"
              >
                {member.photo ? (
                  <div className="w-20 h-20 rounded-full overflow-hidden mb-5">
                    <Image src={member.photo} alt={member.name} width={80} height={80} className="w-full h-full object-cover" />
                  </div>
                ) : (
                  <div className="w-20 h-20 bg-[#1e3a51] rounded-full flex items-center justify-center mb-5">
                    <span className="text-[#c9a962] text-2xl font-['Playfair_Display'] font-semibold">
                      {member.name.split(" ").map((w) => w[0]).join("").slice(0, 2)}
                    </span>
                  </div>
                )}
                <h2 className="text-[#f5f3f0] font-semibold group-hover:text-[#c9a962] transition-colors">
                  {member.name}
                </h2>
                <p className="text-[#c9a962] text-sm mt-1">{member.position}</p>
                {member.specialization && (
                  <p className="text-[#5a6f80] text-sm mt-2">{member.specialization}</p>
                )}
                {member.bio && (
                  <p className="text-[#8b9caa] text-sm mt-3 line-clamp-3">{member.bio}</p>
                )}
                {member.website && (
                  <p className="text-[#5a6f80] text-xs mt-3 flex items-center gap-1.5">
                    <Globe className="w-3.5 h-3.5 text-[#c9a962]" />
                    <span>{member.website.replace(/^https?:\/\//, "").replace(/\/$/, "")}</span>
                  </p>
                )}
              </Link>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
