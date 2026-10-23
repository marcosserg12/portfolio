import type { Locale } from "@/content/types";

export const LOCALE_STORAGE_KEY = "locale";

export function resolveInitialLocale(stored: string | null, browserLanguage: string | undefined): Locale {
  if (stored === "pt" || stored === "en") return stored;
  if (!browserLanguage) return "pt";
  return browserLanguage.toLowerCase().startsWith("pt") ? "pt" : "en";
}
