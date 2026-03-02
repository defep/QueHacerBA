import Fastify from 'fastify';
import cors from '@fastify/cors';
import { serializerCompiler, validatorCompiler, ZodTypeProvider } from 'fastify-type-provider-zod';
import { db } from '@quehacerba/database';
import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const fastify = Fastify({
  logger: true,
}).withTypeProvider<ZodTypeProvider>();

fastify.setSerializerCompiler(serializerCompiler);
fastify.setValidatorCompiler(validatorCompiler);

fastify.register(cors, {
  origin: true,
  credentials: true,
});

fastify.get('/health', async () => {
  return { status: 'ok', timestamp: new Date().toISOString() };
});

fastify.get('/api/events', async () => {
  return { events: [] };
});

interface RawEvent {
  city: string
  name: string
  description: string
  category: string
  dates: { date: string; start_time: string | null; end_time: string | null }[]
  price: { min: number; max: number } | null
  venue: { name: string; address: string }
  sources: { name: string; type: string; url: string }[]
}

interface Event {
  name: string
  description: string
  category: string
  status: string
  date: string
  start_time: string | null
  end_time: string | null
  is_free: boolean | null
  price_text: string | null
  price_min: number | null
  price_max: number | null
  venue: string | null
  address: string
  audience: string[]
  sources: { entity: string; type: string; url: string }[]
}

interface City {
  city: string
  events: Event[]
}

interface Agenda {
  cities: City[]
}

function processPrice(price: { min: number; max: number } | null): { is_free: boolean | null; price_text: string | null; price_min: number | null; price_max: number | null } {
  if (price === null) {
    return { is_free: null, price_text: 'Precio desconocido', price_min: null, price_max: null };
  }
  if (price.min === 0 && price.max === 0) {
    return { is_free: true, price_text: 'Gratis', price_min: 0, price_max: 0 };
  }
  if (price.min > 0) {
    const minStr = price.min.toLocaleString('es-AR', { style: 'currency', currency: 'ARS' });
    const maxStr = price.max.toLocaleString('es-AR', { style: 'currency', currency: 'ARS' });
    if (price.min === price.max) {
      return { is_free: false, price_text: minStr, price_min: price.min, price_max: price.max };
    }
    return { is_free: false, price_text: `${minStr} - ${maxStr}`, price_min: price.min, price_max: price.max };
  }
  return { is_free: null, price_text: 'Precio desconocido', price_min: null, price_max: null };
}

function processEvents(rawEvents: RawEvent[]): Agenda {
  const cityMap = new Map<string, Event[]>();

  for (const raw of rawEvents) {
    for (const dateInfo of raw.dates) {
      const priceInfo = processPrice(raw.price);
      const event: Event = {
        name: raw.name,
        description: raw.description,
        category: raw.category,
        status: 'active',
        date: dateInfo.date,
        start_time: dateInfo.start_time,
        end_time: dateInfo.end_time,
        is_free: priceInfo.is_free,
        price_text: priceInfo.price_text,
        price_min: priceInfo.price_min,
        price_max: priceInfo.price_max,
        venue: raw.venue.name,
        address: raw.venue.address,
        audience: [],
        sources: raw.sources.map(s => ({ entity: s.name, type: s.type, url: s.url }))
      };

      if (!cityMap.has(raw.city)) {
        cityMap.set(raw.city, []);
      }
      cityMap.get(raw.city)!.push(event);
    }
  }

  const cities: City[] = Array.from(cityMap.entries()).map(([city, events]) => ({
    city,
    events: events.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
  }));

  return { cities };
}

fastify.get('/api/agenda', async () => {
  const dataPath = path.resolve(__dirname, './data/march_2026_v2.json');
  const data = await fs.readFile(dataPath, 'utf-8');
  const raw = JSON.parse(data) as { events: RawEvent[] };
  const agenda = processEvents(raw.events);
  return { agenda };
});

const start = async () => {
  try {
    await fastify.listen({ port: 3001, host: '0.0.0.0' });
    console.log('API running on http://localhost:3001');
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};

start();
