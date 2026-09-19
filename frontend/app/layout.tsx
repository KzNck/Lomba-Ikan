import type { Metadata } from "next";
import { Dancing_Script, Geist, Geist_Mono, Inter, Poppins } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/shared/navbar";

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

export const metadata: Metadata = {
  title: "ByCatch Loop | Sirkular Bahari Nusantara",
  description: "Platform Sirkular Maritim Terintegrasi. Ubah hasil tangkapan sampingan menjadi peluang bernilai tambah.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="id"
      data-scroll-behavior="smooth"
      className={`${geistSans.variable} ${geistMono.variable} ${inter.variable} ${poppins.variable} ${dancingScript.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-zinc-50 text-zinc-900 dark:bg-zinc-950 dark:text-zinc-100">
        <Navbar />
        <main className="flex-1">{children}</main>
      </body>
    </html>
  );
}
