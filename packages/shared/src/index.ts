import { z } from 'zod';

export const EventSchema = z.object({
  id: z.string().uuid(),
  title: z.string().min(1).max(255),
  description: z.string().nullable(),
  location: z.string().nullable(),
  startDate: z.string().datetime(),
  endDate: z.string().datetime().nullable(),
  category: z.enum(['music', 'theater', 'exhibition', 'sports', 'other']),
  imageUrl: z.string().url().nullable(),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
});

export type Event = z.infer<typeof EventSchema>;

export const CreateEventSchema = EventSchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export type CreateEvent = z.infer<typeof CreateEventSchema>;

export const UpdateEventSchema = CreateEventSchema.partial();

export type UpdateEvent = z.infer<typeof UpdateEventSchema>;
