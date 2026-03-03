import type { Metadata } from "next";
import { Playfair_Display, Open_Sans } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { BackToTop } from "@/components/BackToTop";

const playfair = Playfair_Display({
  subsets: ["latin", "cyrillic"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
  variable: "--font-playfair",
});

const openSans = Open_Sans({
  subsets: ["latin", "cyrillic"],
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
  variable: "--font-open-sans",
});

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://sementsov.ru";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "МКА «Семенцов и Партнёры» — Коллегия адвокатов в Москве",
    template: "%s | МКА «Семенцов и Партнёры»",
  },
  description:
    "Московская коллегия адвокатов «Семенцов и Партнёры» — юридические услуги с 1997 года. Уголовное, гражданское, корпоративное право. ЕСПЧ, Верховный суд. +7 (495) 629 82 50.",
  openGraph: {
    type: "website",
    locale: "ru_RU",
    siteName: "МКА «Семенцов и Партнёры»",
    title: "МКА «Семенцов и Партнёры» — Коллегия адвокатов в Москве",
    description:
      "Московская коллегия адвокатов «Семенцов и Партнёры» — юридические услуги с 1997 года.",
    images: [{ url: "/og-image.png", width: 1200, height: 630 }],
  },
  twitter: {
    card: "summary_large_image",
    title: "МКА «Семенцов и Партнёры»",
    description:
      "Коллегия адвокатов в Москве. Уголовное, гражданское, корпоративное право.",
    images: ["/og-image.png"],
  },
  alternates: {
    canonical: "/",
  },
  icons: {
    icon: "/favicon.ico",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "LegalService",
  name: "МКА «Семенцов и Партнёры»",
  url: SITE_URL,
  logo: `${SITE_URL}/logo.png`,
  description:
    "Московская коллегия адвокатов «Семенцов и Партнёры» — юридические услуги с 1997 года.",
  telephone: "+7 (495) 629 82 50",
  email: "info@sementsov.ru",
  address: {
    "@type": "PostalAddress",
    addressCountry: "RU",
    addressLocality: "Москва",
    streetAddress: "Б. Козихинский пер., д. 7, стр. 1",
  },
  foundingDate: "1997",
  areaServed: {
    "@type": "Country",
    name: "Россия",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ru" className={`${playfair.variable} ${openSans.variable}`}>
      <body>
        <a href="#main" className="skip-to-content">Перейти к содержимому</a>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <Header />
        <main id="main" className="min-h-screen">{children}</main>
        <Footer />
        <BackToTop />
      </body>
    </html>
  );
}
