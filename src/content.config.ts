import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

// The McLetter — markdown letters in src/content/letters/.
const letters = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/letters' }),
  schema: z.object({
    title: z.string(),
    date: z.coerce.date().optional(),
    excerpt: z.string().optional(),
    image: z.string().optional(),
    draft: z.boolean().default(false),
  }),
});

export const collections = { letters };
