import { z } from 'zod';

export const SourceSchema = z.object({
  entity: z.string(),
  type: z.string(),
  url: z.string(),
});

export const EventDbSchema = z.object({
  id: z.string().uuid().optional(),
  city: z.string(),
  name: z.string(),
  description: z.string().nullable(),
  category: z.string(),
  status: z.string(),
  date: z.union([z.string(), z.date()]),
  start_time: z.string().nullable(),
  end_time: z.string().nullable(),
  is_free: z.boolean().nullable(),
  price_min: z.number().nullable(),
  price_max: z.number().nullable(),
  venue: z.string().nullable(),
  address: z.string().nullable(),
  audience: z.array(z.string()),
  sources: z.array(SourceSchema),
  created_at: z.date().optional(),
  updated_at: z.date().optional(),
});

export const EventApiSchema = EventDbSchema.omit({
  price_min: true,
  price_max: true,
}).extend({
  date: z.string(),
  price_text: z.string().nullable(),
  price_min: z.number().nullable(),
  price_max: z.number().nullable(),
});

export type EventDb = z.infer<typeof EventDbSchema>;
export type EventApi = z.infer<typeof EventApiSchema>;
export type Source = z.infer<typeof SourceSchema>;

export const CitySchema = z.object({
  city: z.string(),
  events: z.array(EventApiSchema),
});

export type City = z.infer<typeof CitySchema>;

export const AgendaSchema = z.object({
  cities: z.array(CitySchema),
});

export type Agenda = z.infer<typeof AgendaSchema>;

export const EventsQuerySchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(20),
  audience: z.string().optional(),
  city: z.string().optional(),
});

export type EventsQuery = z.infer<typeof EventsQuerySchema>;
