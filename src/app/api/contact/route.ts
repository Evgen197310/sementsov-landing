import { prisma } from "@/lib/db";
import { NextResponse } from "next/server";
import { rateLimit } from "@/lib/rate-limit";
import { logRequest, logResponse, logError } from "@/lib/logger";

export async function GET() {
  logRequest("/api/contact", "GET");
  const messages = await prisma.contactMessage.findMany({ orderBy: { createdAt: "desc" } });
  logResponse("/api/contact", "GET", 200, { count: messages.length });
  return NextResponse.json(messages);
}

export async function POST(request: Request) {
  try {
    const ip = request.headers.get("x-forwarded-for") || "unknown";
    logRequest("/api/contact", "POST", { ip });
    const rl = rateLimit(`contact:${ip}`, { maxRequests: 3, windowMs: 60_000 });
    if (!rl.ok) {
      return NextResponse.json(
        { error: "Слишком много сообщений. Попробуйте позже." },
        { status: 429, headers: { "Retry-After": String(rl.retryAfter) } }
      );
    }

    const body = await request.json();
    const { name, email, phone, service, message } = body;

    if (!name || !email || !message) {
      return NextResponse.json({ error: "Заполните обязательные поля" }, { status: 400 });
    }

    await prisma.contactMessage.create({
      data: { name, email, phone: phone || "", service: service || "", message },
    });

    logResponse("/api/contact", "POST", 200);
    return NextResponse.json({ success: true });
  } catch (e) {
    logError("/api/contact", "POST", e);
    return NextResponse.json({ error: "Ошибка сервера" }, { status: 500 });
  }
}
