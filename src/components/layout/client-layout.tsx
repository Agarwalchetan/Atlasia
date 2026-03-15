"use client";

import { ReactNode } from "react";
import { Toaster } from "sonner";
import { Navbar } from "./navbar";
import { LanguageProvider, useLanguage } from "@/lib/language-context";

function LayoutInner({ children }: { children: ReactNode }) {
  const { language, setLanguage } = useLanguage();
  return (
    <div className="min-h-screen bg-stone-950">
      <Navbar selectedLanguage={language} onLanguageChange={setLanguage} />
      <main>{children}</main>
      <Toaster
        theme="dark"
        toastOptions={{
          style: {
            background: "rgba(28,25,23,0.95)",
            border: "1px solid rgba(168,162,158,0.12)",
            color: "#fafaf9",
            backdropFilter: "blur(24px)",
          },
        }}
      />
    </div>
  );
}

export function ClientLayout({ children }: { children: ReactNode }) {
  return (
    <LanguageProvider>
      <LayoutInner>{children}</LayoutInner>
    </LanguageProvider>
  );
}
