"use client";

import { createContext, useContext, useState, ReactNode } from "react";

interface LanguageContextType {
  language: string;
  setLanguage: (lang: string) => void;
  languageName: string;
}

const LanguageContext = createContext<LanguageContextType>({
  language: "en",
  setLanguage: () => {},
  languageName: "English",
});

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState("en");

  const languageNames: Record<string, string> = {
    en: "English",
    ja: "Japanese",
    zh: "Chinese",
    es: "Spanish",
    fr: "French",
    de: "German",
    it: "Italian",
    pt: "Portuguese",
    ar: "Arabic",
    hi: "Hindi",
    ko: "Korean",
    ru: "Russian",
    tr: "Turkish",
    th: "Thai",
    vi: "Vietnamese",
  };

  return (
    <LanguageContext.Provider
      value={{
        language,
        setLanguage,
        languageName: languageNames[language] || "English",
      }}
    >
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  return useContext(LanguageContext);
}
