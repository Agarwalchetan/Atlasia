import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ClientLayout } from "@/components/layout/client-layout";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "Atlasia – Travel the world without language barriers",
  description:
    "AI-powered global travel intelligence platform. Explore interactive maps, get instant travel guides, real-time translation, cultural tips, and emergency assistance in any language.",
  keywords: ["travel", "translation", "AI", "travel guide", "multilingual", "cultural intelligence"],
  openGraph: {
    title: "Atlasia – Global Travel Intelligence",
    description: "Travel the world without language barriers.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.variable} font-sans antialiased bg-slate-950 text-white`}>
        <ClientLayout>{children}</ClientLayout>
      </body>
    </html>
  );
}
