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
  city: string
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

function processPriceDb(priceMin: number | null, priceMax: number | null): { is_free: boolean | null; price_text: string | null } {
  if (priceMin === null && priceMax === null) {
    return { is_free: null, price_text: 'Precio desconocido' };
  }
  if ((priceMin === 0 || priceMin === null) && (priceMax === 0 || priceMax === null)) {
    return { is_free: true, price_text: 'Gratis' };
  }
  if (priceMin && priceMax) {
    const minStr = priceMin.toLocaleString('es-AR', { style: 'currency', currency: 'ARS' });
    const maxStr = priceMax.toLocaleString('es-AR', { style: 'currency', currency: 'ARS' });
    if (priceMin === priceMax) {
      return { is_free: false, price_text: minStr };
    }
    return { is_free: false, price_text: `${minStr} - ${maxStr}` };
  }
  return { is_free: null, price_text: 'Precio desconocido' };
}


fastify.get('/api/agenda', async () => {
  const dbEvents = await db.selectFrom('events').selectAll().execute();

  let events: Event[] = []

  for (const evt of dbEvents) {
    const priceMin = evt.price_min ? Number(evt.price_min) : null;
    const priceMax = evt.price_max ? Number(evt.price_max) : null;
    const priceInfo = processPriceDb(priceMin, priceMax);
    const event: Event = {
      city: evt.city,
      name: evt.name,
      description: evt.description || '',
      category: evt.category,
      status: evt.status,
      date: evt.date instanceof Date ? evt.date.toISOString().split('T')[0] as string : String(evt.date),
      start_time: evt.start_time,
      end_time: evt.end_time,
      is_free: evt.is_free,
      price_text: priceInfo.price_text,
      price_min: priceMin,
      price_max: priceMax,
      venue: evt.venue,
      address: evt.address || '',
      audience: typeof evt.audience === 'string' ? JSON.parse(evt.audience) : evt.audience || [],
      sources: typeof evt.sources === 'string' ? JSON.parse(evt.sources) : evt.sources || [],
    };
    events.push(event)
  }

  events = events.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())

  return { events };
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
