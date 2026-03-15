"use client";

import { ReactNode } from "react";
import { Toaster } from "sonner";
import { Navbar } from "./navbar";
import { LanguageProvider, useLanguage } from "@/lib/language-context";

function LayoutInner({ children }: { children: ReactNode }) {
  const { language, setLanguage } = useLanguage();
  return (
    <div className="min-h-screen bg-slate-950">
      <Navbar selectedLanguage={language} onLanguageChange={setLanguage} />
      <main>{children}</main>
      <Toaster
        theme="dark"
        toastOptions={{
          style: {
            background: "rgba(15,23,42,0.95)",
            border: "1px solid rgba(255,255,255,0.1)",
            color: "white",
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
