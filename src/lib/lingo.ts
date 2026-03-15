import { LingoDotDevEngine } from "@lingo.dev/_sdk";

let engine: LingoDotDevEngine | null = null;

function getEngine(): LingoDotDevEngine {
  if (!engine) {
    engine = new LingoDotDevEngine({
      apiKey: process.env.LINGO_DEV_API_KEY || "",
    });
  }
  return engine;
}

/**
 * Localize a string using Lingo.dev
 */
export async function localizeText(
  text: string,
  targetLocale: string,
  sourceLocale = "en"
): Promise<string> {
  if (!process.env.LINGO_DEV_API_KEY || targetLocale === sourceLocale) {
    return text;
  }
  try {
    const eng = getEngine();
    return await eng.localizeText(text, { sourceLocale, targetLocale });
  } catch (err) {
    console.error("Lingo.dev localizeText error:", err);
    return text;
  }
}

/**
 * Localize an object using Lingo.dev
 */
export async function localizeObject<T extends Record<string, unknown>>(
  obj: T,
  targetLocale: string,
  sourceLocale = "en"
): Promise<T> {
  if (!process.env.LINGO_DEV_API_KEY || targetLocale === sourceLocale) {
    return obj;
  }
  try {
    const eng = getEngine();
    const result = await eng.localizeObject(obj as Record<string, unknown>, {
      sourceLocale,
      targetLocale,
    });
    return result as T;
  } catch (err) {
    console.error("Lingo.dev localizeObject error:", err);
    return obj;
  }
}

/**
 * Localize an array of strings using Lingo.dev
 */
export async function localizeStringArray(
  strings: string[],
  targetLocale: string,
  sourceLocale = "en"
): Promise<string[]> {
  if (!process.env.LINGO_DEV_API_KEY || targetLocale === sourceLocale) {
    return strings;
  }
  try {
    const eng = getEngine();
    return await eng.localizeStringArray(strings, { sourceLocale, targetLocale });
  } catch (err) {
    console.error("Lingo.dev localizeStringArray error:", err);
    return strings;
  }
}
