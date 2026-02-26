import type { Metadata } from "next";
import "./globals.css";
import ClientBody from "./ClientBody";

export const metadata: Metadata = {
  metadataBase: new URL("https://sementsov.trust.moscow"),
  title: {
    default: "МКА «Семенцов и Партнёры» | Адвокаты в Москве — юридические услуги с 1997 года",
    template: "%s | МКА «Семенцов и Партнёры»",
  },
  description: "Московская коллегия адвокатов «Семенцов и Партнёры» — 27 лет опыта. Арбитраж, уголовное право, корпоративные споры, защита бизнеса. Круглосуточная юридическая помощь. +7 (495) 629-82-50",
  keywords: [
    "адвокат Москва",
    "коллегия адвокатов",
    "Семенцов и Партнёры",
    "юридические услуги",
    "арбитраж",
    "уголовное право",
    "корпоративные споры",
    "семейное право",
    "наследственное право",
    "жилищное право",
    "трудовое право",
    "медиация",
    "защита бизнеса",
    "юрист Москва",
  ],
  authors: [{ name: "МКА «Семенцов и Партнёры»" }],
  creator: "МКА «Семенцов и Партнёры»",
  publisher: "МКА «Семенцов и Партнёры»",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  alternates: {
    canonical: "https://sementsov.trust.moscow",
  },
  openGraph: {
    type: "website",
    locale: "ru_RU",
    url: "https://sementsov.trust.moscow",
    siteName: "МКА «Семенцов и Партнёры»",
    title: "МКА «Семенцов и Партнёры» | Адвокаты в Москве с 1997 года",
    description: "Московская коллегия адвокатов «Семенцов и Партнёры» — 27 лет опыта. 11 адвокатов. Арбитраж, уголовное право, корпоративные споры, защита бизнеса. Круглосуточно. +7 (495) 629-82-50",
    images: [
      {
        url: "https://sementsov.trust.moscow/og-image.png",
        width: 1200,
        height: 630,
        alt: "МКА «Семенцов и Партнёры» — адвокаты в Москве с 1997 года",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "МКА «Семенцов и Партнёры» | Адвокаты в Москве",
    description: "Московская коллегия адвокатов — 27 лет опыта, 11 адвокатов. Круглосуточно. +7 (495) 629-82-50",
    images: ["https://sementsov.trust.moscow/og-image.png"],
  },
  category: "Юридические услуги",
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "48x48" },
      { url: "/favicon.svg", type: "image/svg+xml" },
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
    ],
    apple: [
      { url: "/apple-touch-icon.png", sizes: "180x180" },
    ],
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "LegalService",
      "@id": "https://sementsov.trust.moscow/#organization",
      name: "Московская коллегия адвокатов «Семенцов и Партнёры»",
      alternateName: "МКА «Семенцов и Партнёры»",
      description: "Юридическая компания, работающая в России с 1997 года. Арбитраж, уголовное право, корпоративные споры, семейное, наследственное, жилищное, трудовое, земельное право. Международное партнёрство.",
      url: "https://sementsov.trust.moscow",
      telephone: "+7 (495) 629-82-50",
      email: "vsementsov11@mail.ru",
      foundingDate: "1997",
      address: {
        "@type": "PostalAddress",
        streetAddress: "ул. Большая Дмитровка, д. 20/5, стр. 2, оф. 20",
        addressLocality: "Москва",
        postalCode: "107031",
        addressCountry: "RU",
      },
      geo: {
        "@type": "GeoCoordinates",
        latitude: 55.7632,
        longitude: 37.6136,
      },
      openingHours: "Mo-Su 00:00-23:59",
      priceRange: "$$$$",
      areaServed: {
        "@type": "Country",
        name: "Россия",
      },
      numberOfEmployees: {
        "@type": "QuantitativeValue",
        value: 11,
      },
      knowsAbout: [
        "Арбитраж",
        "Уголовное право",
        "Корпоративные споры",
        "Семейное право",
        "Наследственное право",
        "Жилищное право",
        "Трудовое право",
        "Земельное право",
        "Медиация",
        "Исполнительное производство",
      ],
    },
    {
      "@type": "WebSite",
      "@id": "https://sementsov.trust.moscow/#website",
      url: "https://sementsov.trust.moscow",
      name: "МКА «Семенцов и Партнёры»",
      description: "Официальный сайт Московской коллегии адвокатов «Семенцов и Партнёры»",
      publisher: {
        "@id": "https://sementsov.trust.moscow/#organization",
      },
      inLanguage: "ru-RU",
    },
    {
      "@type": "WebPage",
      "@id": "https://sementsov.trust.moscow/#webpage",
      url: "https://sementsov.trust.moscow",
      name: "МКА «Семенцов и Партнёры» | Адвокаты в Москве с 1997 года",
      isPartOf: {
        "@id": "https://sementsov.trust.moscow/#website",
      },
      about: {
        "@id": "https://sementsov.trust.moscow/#organization",
      },
      inLanguage: "ru-RU",
    },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ru" suppressHydrationWarning>
      <head>
        <link rel="manifest" href="/site.webmanifest" />
        <meta name="geo.region" content="RU-MOW" />
        <meta name="geo.placename" content="Москва" />
        <meta name="geo.position" content="55.7632;37.6136" />
        <meta name="ICBM" content="55.7632, 37.6136" />
        <link rel="preload" href="/fonts/open-sans-cyrillic.woff2" as="font" type="font/woff2" crossOrigin="anonymous" />
        <link rel="preload" href="/fonts/playfair-cyrillic.woff2" as="font" type="font/woff2" crossOrigin="anonymous" />
        <link rel="stylesheet" href="/fonts/fonts.css" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        {/* Yandex Metrika — deferred via requestIdleCallback */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function(){
                function initMetrika(){
                  (function(m,e,t,r,i,k,a){m[i]=m[i]||function(){(m[i].a=m[i].a||[]).push(arguments)};
                  m[i].l=1*new Date();
                  for(var j=0;j<document.scripts.length;j++){if(document.scripts[j].src===r)return;}
                  k=e.createElement(t),a=e.getElementsByTagName(t)[0],k.async=1,k.src=r,a.parentNode.insertBefore(k,a)})
                  (window,document,"script","https://mc.yandex.ru/metrika/tag.js","ym");
                  ym(000000000,"init",{clickmap:true,trackLinks:true,accurateTrackBounce:true,webvisor:true});
                }
                if(typeof requestIdleCallback==='function'){requestIdleCallback(initMetrika)}
                else{setTimeout(initMetrika,2000)}
              })();
            `,
          }}
        />
        <noscript>
          <div>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="https://mc.yandex.ru/watch/000000000" style={{position:'absolute',left:'-9999px'}} alt="" />
          </div>
        </noscript>
      </head>
      <body className="antialiased">
        <ClientBody>{children}</ClientBody>
      </body>
    </html>
  );
}
