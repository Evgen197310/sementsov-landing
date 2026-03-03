import { prisma } from "@/lib/db";

export const metadata = { title: "Новое в законодательстве — МКА «Семенцов и Партнёры»" };

export default async function LegislationPage() {
  const articles = await prisma.newsArticle.findMany({
    where: { section: "legislation" },
    orderBy: { createdAt: "desc" },
  });

  return (
    <>
      <section className="bg-gradient-to-b from-[#071420] to-[#0b1c2b] py-16 md:py-24">
        <div className="container mx-auto px-4 max-w-5xl">
          <h1 className="text-3xl md:text-5xl font-['Playfair_Display'] font-bold text-[#f5f3f0] mb-4">
            Новое в законодательстве
          </h1>
          <div className="decorative-line" />
        </div>
      </section>
      <section className="section-padding">
        <div className="container mx-auto px-4 max-w-5xl">
          {articles.length === 0 ? (
            <p className="text-[#8b9caa]">Пока нет публикаций.</p>
          ) : (
            <div className="space-y-4">
              {articles.map((a) => (
                <div key={a.id} className="bg-[#0f2133] border border-[#1e3a51]/30 rounded-xl p-6">
                  <div className="text-[#5a6f80] text-xs mb-2">{a.createdAt.toLocaleDateString("ru-RU")}</div>
                  <h2 className="text-[#f5f3f0] font-semibold">{a.title}</h2>
                  {a.excerpt && <p className="text-[#8b9caa] text-sm mt-2">{a.excerpt}</p>}
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  );
}
