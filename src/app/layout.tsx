import type { Metadata } from "next";
import "./globals.css";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";

export const metadata: Metadata = {
  title: "МКА «Семенцов и Партнёры» — Коллегия адвокатов в Москве",
  description:
    "Московская коллегия адвокатов «Семенцов и Партнёры» — юридические услуги с 1997 года. Уголовное, гражданское, корпоративное право. ЕСПЧ, Верховный суд. +7 (495) 629 82 50.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ru">
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;500;600;700&family=Open+Sans:wght@300;400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        <Header />
        <main className="min-h-screen">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
