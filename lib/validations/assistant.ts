import { z } from 'zod';

export const createAssistantSchema = z.object({
  name: z
    .string()
    .min(1, 'Name is required')
    .refine((name) => {
      const words = name
        .trim()
        .split(/\s+/)
        .filter((word) => word.length > 0);
      return words.length >= 2;
    }, 'Assistant name must have at least 2 words'),
  instructions: z
    .string()
    .min(1, 'Instructions are required')
    .refine((instructions) => {
      const sentences = instructions
        .trim()
        .split(/[.!?]+/)
        .filter((sentence) => sentence.trim().length > 0);
      return sentences.length >= 2;
    }, 'Instructions must have at least 2 sentences'),
  avatar: z.string().min(1, 'Avatar is required'),
});

export type CreateAssistantInput = z.infer<typeof createAssistantSchema>;
