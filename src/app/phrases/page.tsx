"use client";

import { useState, useRef, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Languages,
  Volume2,
  Search,
  Loader2,
  MapPin,
  Filter,
  Copy,
  Check,
  Sparkles,
  Globe,
  HandMetal,
  Map,
  Utensils,
  Siren,
  Bus,
  ShoppingBag,
  BedDouble,
  type LucideIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { LoadingOverlay } from "@/components/ui/loading";
import { useLanguage } from "@/lib/language-context";
import { useTranslations } from "@/lib/use-translations";
import { PHRASE_CATEGORIES } from "@/lib/utils";
import type { Phrase } from "@/types";

const LUCIDE_MAP: Record<string, LucideIcon> = {
  HandMetal, Map, Utensils, Siren, Bus, ShoppingBag, BedDouble, Globe,
};

function PhrasesPageContent() {
  const searchParams = useSearchParams();
  const { language } = useLanguage();
  const t = useTranslations({
    pageTitle: "Phrase Assistant",
    pageSubtitle: "Essential travel phrases with pronunciation & audio",
    inputPlaceholder: "Enter destination (e.g. Tokyo, Japan)...",
    getPhrasesBtn: "Get Phrases",
    searchPlaceholder: "Search phrases...",
    noMatchFilter: "No phrases match your filter",
    emptyTitle: "Ready for your journey?",
    emptyDesc: "Enter your destination above to get essential travel phrases with pronunciation guides",
    englishLabel: "English",
    translationLabel: "Translation",
    allCategory: "All",
  });
  const [locationInput, setLocationInput] = useState(searchParams.get("location") || "");
  const [activeCategory, setActiveCategory] = useState("all");
  const [phrases, setPhrases] = useState<Phrase[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [playingId, setPlayingId] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Auto-fetch if a ?location= param is present on mount
  const initialLocation = searchParams.get("location");
  useEffect(() => {
    if (initialLocation) {
      handleFetchPhrases(initialLocation);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialLocation]);

  const handleFetchPhrases = async (loc?: string) => {
    const location = loc || locationInput;
    if (!location.trim()) return;
    setIsLoading(true);
    try {
      const res = await fetch("/api/phrases", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          location,
          category: activeCategory !== "all" ? activeCategory : undefined,
          language,
        }),
      });
      const data = await res.json();
      if (Array.isArray(data.phrases)) setPhrases(data.phrases);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handlePlayAudio = async (phrase: Phrase) => {
    setPlayingId(phrase.id);
    try {
      const res = await fetch("/api/speech/tts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: phrase.translated, voice: "nova" }),
      });
      if (!res.ok) throw new Error("TTS failed");
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      if (audioRef.current) audioRef.current.pause();
      audioRef.current = new Audio(url);
      audioRef.current.play();
      audioRef.current.onended = () => setPlayingId(null);
    } catch {
      setPlayingId(null);
    }
  };

  const handleCopy = (phrase: Phrase) => {
    navigator.clipboard.writeText(phrase.translated);
    setCopiedId(phrase.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const filteredPhrases = phrases.filter((p) => {
    const matchesCategory = activeCategory === "all" || p.category === activeCategory;
    const matchesSearch =
      !searchQuery ||
      p.english.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.translated.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const categoryData = [
          { id: "all", label: t.allCategory, icon: "Globe" },
    ...PHRASE_CATEGORIES,
  ];

  return (
    <div className="min-h-screen bg-stone-950 pt-16">
      <div className="fixed inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,rgba(13,148,136,0.04),transparent)] pointer-events-none" />

      <div className="px-4 sm:px-6 lg:px-8 py-6">
        <div className="max-w-5xl mx-auto">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-3 mb-6"
          >
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-teal-500 to-teal-600 flex items-center justify-center">
              <Languages size={18} className="text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold font-[family-name:var(--font-sora)] text-stone-50">{t.pageTitle}</h1>
              <p className="text-stone-400 text-sm">
                {t.pageSubtitle}
              </p>
            </div>
          </motion.div>

          {/* Search Bar */}
          <div className="flex gap-3 mb-6">
            <div className="relative flex-1">
              <MapPin size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-500" />
              <Input
                placeholder={t.inputPlaceholder}
                value={locationInput}
                onChange={(e) => setLocationInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleFetchPhrases()}
                className="pl-9"
              />
            </div>
            <Button onClick={() => handleFetchPhrases()} disabled={isLoading} className="gap-2 shrink-0">
              {isLoading ? <Loader2 size={16} className="animate-spin" /> : <Sparkles size={16} />}
              {t.getPhrasesBtn}
            </Button>
          </div>

          {/* Category Filter */}
          {phrases.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex gap-2 overflow-x-auto pb-2 mb-4"
            >
              {categoryData.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setActiveCategory(cat.id)}
                  className={`shrink-0 flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-medium transition-colors cursor-pointer active:scale-[0.97] ${
                    activeCategory === cat.id
                      ? "bg-amber-500/20 text-amber-400 border border-amber-500/30"
                      : "bg-stone-900/60 text-stone-400 border border-stone-800 hover:bg-stone-800/80"
                  }`}
                >
                  {(() => { const CatIcon = LUCIDE_MAP[cat.icon]; return CatIcon ? <CatIcon size={14} /> : null; })()}
                  {cat.label}
                </button>
              ))}
            </motion.div>
          )}

          {/* Phrase Search */}
          {phrases.length > 0 && (
            <div className="relative mb-6">
              <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-500" />
              <Input
                placeholder={t.searchPlaceholder}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>
          )}

          {/* Content */}
          {isLoading ? (
            <LoadingOverlay message="Generating travel phrases..." />
          ) : filteredPhrases.length > 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="grid grid-cols-1 sm:grid-cols-2 gap-4"
            >
              {filteredPhrases.map((phrase, i) => (
                <motion.div
                  key={phrase.id || i}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.03 }}
                >
                  <Card className="hover:border-stone-700/80 transition-colors duration-300 group">
                    <div className="flex items-start justify-between gap-2 mb-3">
                      <Badge variant="info" className="text-xs shrink-0 gap-1">
                        {(() => { const cat = PHRASE_CATEGORIES.find((c) => c.id === phrase.category); const CatIcon = cat ? LUCIDE_MAP[cat.icon] : undefined; return CatIcon ? <CatIcon size={10} /> : null; })()}
                        {PHRASE_CATEGORIES.find((c) => c.id === phrase.category)?.label || phrase.category}
                      </Badge>
                      <div className="flex items-center gap-1.5">
                        <button
                          onClick={() => handleCopy(phrase)}
                          className="p-1.5 rounded-lg hover:bg-stone-800/80 text-stone-500 hover:text-stone-50 transition-colors cursor-pointer"
                          title="Copy translation"
                        >
                          {copiedId === (phrase.id || String(i)) ? (
                            <Check size={14} className="text-teal-400" />
                          ) : (
                            <Copy size={14} />
                          )}
                        </button>
                        <button
                          onClick={() => handlePlayAudio(phrase)}
                          disabled={playingId === (phrase.id || String(i))}
                          className="p-1.5 rounded-lg bg-teal-500/10 hover:bg-teal-500/20 text-teal-400 transition-colors cursor-pointer disabled:opacity-50"
                          title="Play pronunciation"
                        >
                          {playingId === (phrase.id || String(i)) ? (
                            <Loader2 size={14} className="animate-spin" />
                          ) : (
                            <Volume2 size={14} />
                          )}
                        </button>
                      </div>
                    </div>

                    {/* English */}
                    <div className="mb-3">
                      <div className="text-xs text-stone-500 mb-1">{t.englishLabel}</div>
                      <p className="text-sm text-stone-300">{phrase.english}</p>
                    </div>

                    {/* Translation */}
                    <div className="p-3 rounded-xl bg-stone-900/60 border border-stone-800/60 mb-2">
                      <div className="text-xs text-stone-500 mb-1.5">{t.translationLabel}</div>
                      <p className="text-base text-stone-50 font-medium font-mono leading-snug">
                        {phrase.translated}
                      </p>
                    </div>

                    {/* Pronunciation */}
                    {phrase.pronunciation && (
                        <div className="flex items-start gap-2 text-xs text-amber-500/70">
                        <Volume2 size={12} className="shrink-0 text-amber-500/70" />
                        <span className="italic font-mono">{phrase.pronunciation}</span>
                      </div>
                    )}
                  </Card>
                </motion.div>
              ))}
            </motion.div>
          ) : phrases.length > 0 ? (
            <div className="text-center py-12">
              <Filter size={24} className="mx-auto mb-2 text-stone-600" />
              <p className="text-stone-400 text-sm">{t.noMatchFilter}</p>
            </div>
          ) : (
            <div className="text-center py-20">
              <div className="w-16 h-16 rounded-2xl bg-stone-900/60 flex items-center justify-center mx-auto mb-4">
                <Languages size={28} className="text-stone-600" />
              </div>
              <h3 className="text-stone-400 font-medium mb-2">{t.emptyTitle}</h3>
              <p className="text-stone-500 text-sm max-w-xs mx-auto">
                {t.emptyDesc}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function PhrasesPage() {
  return (
    <Suspense fallback={<LoadingOverlay message="Loading..." />}>
      <PhrasesPageContent />
    </Suspense>
  );
}
