import { prisma } from "@/lib/db";
import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, GraduationCap, Briefcase, Award, Globe } from "lucide-react";

export const revalidate = 3600;

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const member = await prisma.teamMember.findUnique({ where: { slug } });
  if (!member) return { title: "Адвокат не найден" };
  return { title: `${member.name} — МКА «Семенцов и Партнёры»` };
}

export default async function TeamMemberPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const member = await prisma.teamMember.findUnique({ where: { slug } });
  if (!member) notFound();

  return (
    <>
      <section className="bg-gradient-to-b from-[#071420] to-[#0b1c2b] py-16 md:py-24">
        <div className="container mx-auto px-4 max-w-4xl">
          <Link href="/team" className="inline-flex items-center gap-2 text-[#8b9caa] hover:text-[#c9a962] transition-colors text-sm mb-8">
            <ArrowLeft className="w-4 h-4" /> Вся команда
          </Link>
          <div className="flex flex-col md:flex-row gap-8 items-start">
            {member.photo ? (
              <div className="w-24 h-24 rounded-full overflow-hidden flex-shrink-0">
                <Image src={member.photo} alt={member.name} width={96} height={96} sizes="96px" className="w-full h-full object-cover" />
              </div>
            ) : (
              <div className="w-24 h-24 bg-[#1e3a51] rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-[#c9a962] text-3xl font-['Playfair_Display'] font-semibold">
                  {member.name.split(" ").map((w) => w[0]).join("").slice(0, 2)}
                </span>
              </div>
            )}
            <div>
              <h1 className="text-3xl md:text-4xl font-['Playfair_Display'] font-bold text-[#f5f3f0] mb-2">
                {member.name}
              </h1>
              <p className="text-[#c9a962] text-lg">{member.position}</p>
              {member.specialization && (
                <p className="text-[#8b9caa] mt-2">{member.specialization}</p>
              )}
            </div>
          </div>
        </div>
      </section>

      <section className="section-padding">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="grid md:grid-cols-3 gap-8">
            <div className="md:col-span-2 space-y-6">
              {member.bio && (
                <div>
                  <h2 className="text-xl font-['Playfair_Display'] font-semibold text-[#f5f3f0] mb-4">
                    Биография
                  </h2>
                  <div className="text-[#8b9caa] leading-relaxed whitespace-pre-line">{member.bio}</div>
                </div>
              )}
              {member.experience && (
                <div>
                  <h2 className="text-xl font-['Playfair_Display'] font-semibold text-[#f5f3f0] mb-4">
                    Опыт работы
                  </h2>
                  <div className="text-[#8b9caa] leading-relaxed whitespace-pre-line">{member.experience}</div>
                </div>
              )}
            </div>
            <div className="space-y-4">
              {member.education && (
                <div className="bg-[#0f2133] border border-[#1e3a51]/30 rounded-xl p-5">
                  <GraduationCap className="w-5 h-5 text-[#c9a962] mb-2" />
                  <h3 className="text-[#f5f3f0] text-sm font-semibold mb-1">Образование</h3>
                  <p className="text-[#8b9caa] text-sm">{member.education}</p>
                </div>
              )}
              {member.specialization && (
                <div className="bg-[#0f2133] border border-[#1e3a51]/30 rounded-xl p-5">
                  <Briefcase className="w-5 h-5 text-[#c9a962] mb-2" />
                  <h3 className="text-[#f5f3f0] text-sm font-semibold mb-1">Специализация</h3>
                  <p className="text-[#8b9caa] text-sm">{member.specialization}</p>
                </div>
              )}
              <div className="bg-[#0f2133] border border-[#1e3a51]/30 rounded-xl p-5">
                <Award className="w-5 h-5 text-[#c9a962] mb-2" />
                <h3 className="text-[#f5f3f0] text-sm font-semibold mb-1">Должность</h3>
                <p className="text-[#8b9caa] text-sm">{member.position}</p>
              </div>
              {member.website && (
                <a href={member.website} target="_blank" rel="noopener noreferrer" className="block bg-[#0f2133] border border-[#1e3a51]/30 rounded-xl p-5 hover:border-[#c9a962]/30 transition-colors">
                  <Globe className="w-5 h-5 text-[#c9a962] mb-2" />
                  <h3 className="text-[#f5f3f0] text-sm font-semibold mb-1">Личный сайт</h3>
                  <p className="text-[#c9a962] text-sm hover:underline">{member.website}</p>
                </a>
              )}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
