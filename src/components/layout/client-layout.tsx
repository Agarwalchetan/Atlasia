"use client";

import { ReactNode } from "react";
import { usePathname } from "next/navigation";
import { Toaster } from "sonner";
import { Navbar } from "./navbar";
import { LanguageProvider, useLanguage } from "@/lib/language-context";

function LayoutInner({ children }: { children: ReactNode }) {
  const { language, setLanguage } = useLanguage();
  const pathname = usePathname();
  const isMapRoute = pathname === "/map";

  return (
    <div className={isMapRoute ? "h-screen overflow-hidden bg-stone-950" : "min-h-screen bg-stone-950"}>
      {!isMapRoute && (
        <Navbar selectedLanguage={language} onLanguageChange={setLanguage} />
      )}
      <main className={isMapRoute ? "h-full" : ""}>{children}</main>
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
