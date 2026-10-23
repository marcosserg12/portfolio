import { describe, expect, it } from "vitest";
import { resolveInitialLocale } from "./locale";

describe("resolveInitialLocale", () => {
  it("prefers a valid stored choice", () => {
    expect(resolveInitialLocale("en", "pt-BR")).toBe("en");
    expect(resolveInitialLocale("pt", "en-US")).toBe("pt");
  });
  it("ignores an invalid stored value", () => {
    expect(resolveInitialLocale("fr", "pt-BR")).toBe("pt");
  });
  it("uses Portuguese for pt-* browsers and English for the rest", () => {
    expect(resolveInitialLocale(null, "pt-BR")).toBe("pt");
    expect(resolveInitialLocale(null, "PT-pt")).toBe("pt");
    expect(resolveInitialLocale(null, "en-US")).toBe("en");
    expect(resolveInitialLocale(null, "de-DE")).toBe("en");
  });
  it("falls back to Portuguese when the browser language is unknown", () => {
    expect(resolveInitialLocale(null, undefined)).toBe("pt");
  });
});
