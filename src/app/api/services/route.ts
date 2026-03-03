import { prisma } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const category = searchParams.get("category");
  const where = category ? { category: { slug: category } } : {};
  const services = await prisma.service.findMany({ where, orderBy: { order: "asc" }, include: { category: true, faqs: { orderBy: { order: "asc" } } } });
  const categories = await prisma.serviceCategory.findMany({ orderBy: { id: "asc" } });
  return NextResponse.json({ services, categories });
}

export async function POST(request: Request) {
  try {
    const data = await request.json();
    const service = await prisma.service.create({
      data: {
        title: data.title,
        slug: data.slug,
        description: data.description || "",
        content: data.content || "",
        icon: data.icon || "",
        order: data.order ?? 0,
        categoryId: data.categoryId,
        faqs: data.faqs?.length
          ? { create: data.faqs.map((f: { question: string; answer: string; order?: number }, i: number) => ({ question: f.question, answer: f.answer, order: f.order ?? i })) }
          : undefined,
      },
    });
    return NextResponse.json(service);
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 500 });
  }
}
