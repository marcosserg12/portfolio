import { existsSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { en } from "./en";
import { pt } from "./pt";

function shape(value: unknown): unknown {
  if (Array.isArray(value)) return value.map(shape);
  if (value && typeof value === "object") {
    return Object.fromEntries(
      Object.entries(value).sort(([a], [b]) => a.localeCompare(b)).map(([k, v]) => [k, shape(v)]),
    );
  }
  return typeof value;
}

function strings(value: unknown, out: string[] = []): string[] {
  if (typeof value === "string") out.push(value);
  else if (Array.isArray(value)) value.forEach((v) => strings(v, out));
  else if (value && typeof value === "object") Object.values(value).forEach((v) => strings(v, out));
  return out;
}

describe("dictionaries", () => {
  it("have the same shape in pt and en", () => {
    expect(shape(en)).toEqual(shape(pt));
  });

  it("contain no empty strings", () => {
    for (const s of [...strings(pt), ...strings(en)]) expect(s.trim()).not.toBe("");
  });

  it("share section ids and project ids", () => {
    expect(en.nav.links.map((l) => l.id)).toEqual(pt.nav.links.map((l) => l.id));
    expect(en.projects.items.map((p) => p.id)).toEqual(pt.projects.items.map((p) => p.id));
  });

  it("point the CV row at a file in public/", () => {
    for (const d of [pt, en]) {
      const cv = d.contact.rows.find((r) => r.id === "cv");
      expect(cv).toBeDefined();
      expect(existsSync(join(process.cwd(), "public", cv!.href))).toBe(true);
    }
  });

  it("use the expected contact link schemes and never print the phone number", () => {
    for (const d of [pt, en]) {
      const byId = Object.fromEntries(d.contact.rows.map((r) => [r.id, r]));
      expect(byId.email.href).toMatch(/^mailto:mstjsousa@gmail\.com/);
      expect(byId.whatsapp.href).toMatch(/^https:\/\/wa\.me\/5561982616352/);
      expect(byId.linkedin.href).toMatch(/^https:\/\/www\.linkedin\.com\/in\//);
      expect(byId.github.href).toBe("https://github.com/marcosserg12");
      const visible = strings(d).filter((s) => !s.startsWith("http") && !s.startsWith("mailto:"));
      expect(visible.join(" ")).not.toMatch(/98261|6352/);
    }
  });
});
