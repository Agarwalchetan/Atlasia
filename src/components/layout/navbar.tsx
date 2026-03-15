"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Globe,
  Map,
  BookOpen,
  Mic,
  AlertTriangle,
  Menu,
  X,
  Languages,
  ChevronDown,
} from "lucide-react";
import { Icon as IconifyIcon } from "@iconify/react";
import { cn } from "@/lib/utils";
import { SUPPORTED_LANGUAGES } from "@/lib/utils";
import { useTranslations } from "@/lib/use-translations";

const NAV_LINK_HREFS = [
  { href: "/map", icon: Map },
  { href: "/travel-guide", icon: BookOpen },
  { href: "/phrases", icon: Languages },
  { href: "/conversation", icon: Mic },
  { href: "/emergency", icon: AlertTriangle },
] as const;

interface NavbarProps {
  selectedLanguage: string;
  onLanguageChange: (lang: string) => void;
}

export function Navbar({ selectedLanguage, onLanguageChange }: NavbarProps) {
  const pathname = usePathname();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [langOpen, setLangOpen] = useState(false);

  const t = useTranslations({
    navMap: "Explore Map",
    navTravelGuide: "Travel Guide",
    navPhrases: "Phrases",
    navConversation: "Conversation",
    navEmergency: "Emergency",
  });

  const navLinks = [
    { href: "/map", label: t.navMap, icon: Map },
    { href: "/travel-guide", label: t.navTravelGuide, icon: BookOpen },
    { href: "/phrases", label: t.navPhrases, icon: Languages },
    { href: "/conversation", label: t.navConversation, icon: Mic },
    { href: "/emergency", label: t.navEmergency, icon: AlertTriangle },
  ];

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const currentLang = SUPPORTED_LANGUAGES.find((l) => l.code === selectedLanguage);

  return (
    <>
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className={cn(
          "fixed top-0 left-0 right-0 z-50 transition-colors duration-300",
          isScrolled
            ? "bg-stone-950/85 backdrop-blur-2xl border-b border-stone-800/60 shadow-2xl shadow-black/30"
            : "bg-transparent"
        )}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2.5 group">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-amber-500 to-amber-700 flex items-center justify-center shadow-lg shadow-amber-900/30 group-hover:shadow-amber-800/50 transition-shadow duration-300">
                <Globe size={16} className="text-white" />
              </div>
              <span className="text-stone-50 font-bold text-xl tracking-tight font-[family-name:var(--font-sora)]">
                Atla<span className="text-amber-500">sia</span>
              </span>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-1">
              {navLinks.map(({ href, label, icon: Icon }) => (
                <Link
                  key={href}
                  href={href}
                  className={cn(
                    "flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-medium transition-colors duration-200",
                    pathname === href
                      ? "bg-amber-500/15 text-amber-400 border border-amber-500/25"
                      : "text-stone-400 hover:text-stone-100 hover:bg-stone-800/50"
                  )}
                >
                  <Icon size={14} />
                  {label}
                </Link>
              ))}
            </div>

            {/* Language Selector + Mobile Menu */}
            <div className="flex items-center gap-3">
              {/* Language Selector */}
              <div className="relative">
                <button
                  onClick={() => setLangOpen(!langOpen)}
                  className="flex items-center gap-2 px-3 py-2 rounded-xl bg-stone-900/60 border border-stone-800 text-stone-300 hover:bg-stone-800/60 hover:text-stone-100 text-sm font-medium transition-colors duration-200 cursor-pointer"
                >
                   <span className="text-base">{currentLang?.flag && <IconifyIcon icon={currentLang.flag} width={20} />}</span>
                  <span className="hidden sm:block">{currentLang?.name}</span>
                  <ChevronDown size={14} className={cn("text-stone-500 transition-transform duration-200", langOpen && "rotate-180")} />
                </button>

                <AnimatePresence>
                  {langOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 8, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 8, scale: 0.95 }}
                      transition={{ duration: 0.15 }}
                      className="absolute right-0 top-full mt-2 w-56 rounded-2xl bg-stone-900/95 backdrop-blur-2xl border border-stone-800/80 shadow-2xl shadow-black/40 overflow-hidden z-50"
                    >
                      <div className="p-2 max-h-72 overflow-y-auto">
                        {SUPPORTED_LANGUAGES.map((lang) => (
                          <button
                            key={lang.code}
                            onClick={() => {
                              onLanguageChange(lang.code);
                              setLangOpen(false);
                            }}
                            className={cn(
                              "w-full flex items-center gap-3 px-3 py-2 rounded-xl text-sm transition-colors duration-150 cursor-pointer",
                              selectedLanguage === lang.code
                                ? "bg-amber-500/15 text-amber-400"
                                : "text-stone-400 hover:bg-stone-800/60 hover:text-stone-100"
                            )}
                          >
                             <span className="text-base"><IconifyIcon icon={lang.flag} width={20} /></span>
                            <div className="flex flex-col items-start">
                              <span className="font-medium">{lang.name}</span>
                              <span className="text-xs text-stone-500">{lang.nativeName}</span>
                            </div>
                          </button>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Mobile Menu Button */}
              <button
                onClick={() => setMobileOpen(!mobileOpen)}
                className="md:hidden p-2 rounded-xl bg-stone-900/60 border border-stone-800 text-stone-400 hover:bg-stone-800/60 hover:text-stone-100 transition-colors duration-200 cursor-pointer"
              >
                {mobileOpen ? <X size={18} /> : <Menu size={18} />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation */}
        <AnimatePresence>
          {mobileOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden border-t border-stone-800/60 bg-stone-950/95 backdrop-blur-2xl overflow-hidden"
            >
              <div className="p-4 space-y-1">
                {navLinks.map(({ href, label, icon: Icon }) => (
                  <Link
                    key={href}
                    href={href}
                    onClick={() => setMobileOpen(false)}
                    className={cn(
                      "flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors duration-200",
                      pathname === href
                        ? "bg-amber-500/15 text-amber-400 border border-amber-500/25"
                        : "text-stone-400 hover:text-stone-100 hover:bg-stone-800/50"
                    )}
                  >
                    <Icon size={16} />
                    {label}
                  </Link>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.nav>

      {/* Backdrop for dropdowns */}
      {(langOpen) && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => { setLangOpen(false); }}
        />
      )}
    </>
  );
}
