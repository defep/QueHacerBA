import Fastify from 'fastify';
import cors from '@fastify/cors';
import { serializerCompiler, validatorCompiler, ZodTypeProvider } from 'fastify-type-provider-zod';
import { db, closeDatabase } from '@quehacerba/database';
import { EventsQuerySchema, EventApiSchema } from '@quehacerba/shared';

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

function parseJsonField<T>(field: unknown, defaultValue: T): T {
  if (typeof field === 'string') {
    try {
      return JSON.parse(field);
    } catch {
      return defaultValue;
    }
  }
  return field as T ?? defaultValue;
}

fastify.get('/api/agenda', async (request) => {
  const query = EventsQuerySchema.parse(request.query);
  const { page, limit, audience, city } = query;
  const offset = (page - 1) * limit;

  let dbEvents = await db.selectFrom('events')
    .selectAll()
    .orderBy('date', 'asc')
    .limit(limit)
    .offset(offset)
    .execute();

  let totalCount = await db.selectFrom('events')
    .select((eb) => eb.fn.countAll().as('count'))
    .execute()
    .then(res => Number(res[0]?.count ?? 0));

  if (city) {
    dbEvents = dbEvents.filter(evt => evt.city === city);
    if (page === 1) {
      totalCount = dbEvents.length;
    }
  }

  const events = dbEvents.map((evt) => {
    const evtAudience = parseJsonField<string[]>(evt.audience, []);
    
    if (audience && !evtAudience.includes(audience)) {
      return null;
    }

    const priceMin = evt.price_min ? Number(evt.price_min) : null;
    const priceMax = evt.price_max ? Number(evt.price_max) : null;
    const priceInfo = processPriceDb(priceMin, priceMax);

    return EventApiSchema.parse({
      ...evt,
      date: evt.date instanceof Date ? evt.date.toISOString().split('T')[0] : String(evt.date),
      description: evt.description || '',
      price_text: priceInfo.price_text,
      price_min: priceMin,
      price_max: priceMax,
      address: evt.address || '',
      audience: evtAudience,
      sources: parseJsonField(evt.sources, []),
    });
  }).filter((e): e is NonNullable<typeof e> => e !== null);

  return {
    events,
    pagination: {
      page,
      limit,
      total: totalCount,
      totalPages: Math.ceil(totalCount / limit),
    }
  };
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

const shutdown = async (signal: string) => {
  console.log(`Received ${signal}, shutting down gracefully...`);
  await fastify.close();
  await closeDatabase();
  process.exit(0);
};

process.on('SIGTERM', () => shutdown('SIGTERM'));
process.on('SIGINT', () => shutdown('SIGINT'));

start();
