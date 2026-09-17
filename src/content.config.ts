import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

// Projekty — editovatelné přes /admin (Decap CMS)
const projekty = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/projekty' }),
  schema: z.object({
    nazev: z.string(),
    stav: z.string(),
    poradi: z.number().default(0),
    foto: z.string(),
    otazka: z.string(),
    popis: z.string(),
  }),
});

// Tým / O nás — editovatelné přes /admin
const tym = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/tym' }),
  schema: z.object({
    jmeno: z.string(),
    role: z.string(),
    poradi: z.number().default(0),
    foto: z.string(),
    mysl: z.string().optional(),
  }),
});

export const collections = { projekty, tym };
