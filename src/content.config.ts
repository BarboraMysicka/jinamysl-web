import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

// Projekty — přehledová karta + detailová stránka. Tělo .md = celý příběh (s ## mezitituly).
const projekty = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/projekty' }),
  schema: z.object({
    nazev: z.string(),
    poradi: z.number().default(0),
    foto: z.string().optional(),          // /images/... ; když chybí (Návrat, Fotbal), karta i detail to ošetří
    kartaText: z.string(),                // krátký text na přehledovou kartu
    metaKarta: z.string(),                // metadata řádek na kartu
    lead: z.string(),                     // výrazná úvodní věta detailu
    perex: z.string().optional(),         // krátká varianta pro horní část detailu / promo
    meta: z.array(z.object({ k: z.string(), v: z.string() })).default([]), // kompaktní blok metadat
    publicita: z.string().optional(),     // povinná publicita (Fotbal)
    pdf: z.string().optional(),           // odkaz na výzkumnou zprávu (zatím prázdné)
    pdfLabel: z.string().optional(),
  }),
});

// Tým / zakladatelky. Tělo .md = medailonek (odstavce).
const tym = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/tym' }),
  schema: z.object({
    jmeno: z.string(),
    role: z.string(),                     // role řádek v medailonku
    foto: z.string(),
    poradi: z.number().default(0),
    statutar: z.string().optional(),      // např. „Předsedkyně Jiná mysl, z. s. · statutární orgán"
    email: z.string().optional(),         // přímý kontakt (zobrazí se na Lidé & kontakty)
    linkedin: z.string().optional(),      // zatím prázdné, doplní se
  }),
});

export const collections = { projekty, tym };
