import type { Metadata } from "next";
import { Dancing_Script, Geist, Geist_Mono, Inter, Poppins } from "next/font/google";
import { NextIntlClientProvider } from "next-intl";
import { getLocale, getTranslations } from "next-intl/server";
import "./globals.css";
import { ServiceWorker } from "@/components/pwa/service-worker";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const inter = Inter({
  variable: "--font-inter-family",
  subsets: ["latin"],
});

const poppins = Poppins({
  variable: "--font-poppins-family",
  weight: ["500", "600", "700", "800"],
  subsets: ["latin"],
});

const dancingScript = Dancing_Script({
  variable: "--font-dancing-family",
  subsets: ["latin"],
});

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("meta");
  return { title: t("title"), description: t("description") };
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // The active locale (i18n/request.ts), so screen readers and hyphenation follow the chosen language.
  const locale = await getLocale();

  return (
    <html
      lang={locale}
      data-scroll-behavior="smooth"
      className={`${geistSans.variable} ${geistMono.variable} ${inter.variable} ${poppins.variable} ${dancingScript.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-zinc-50 text-zinc-900 dark:bg-zinc-950 dark:text-zinc-100">
        <main className="flex-1">
          <NextIntlClientProvider>{children}</NextIntlClientProvider>
        </main>
        <ServiceWorker />
      </body>
    </html>
  );
}
