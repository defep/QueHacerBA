import { getDatabase } from '@quehacerba/database';
import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

interface RawEvent {
  city: string;
  name: string;
  description: string;
  category: string;
  dates: { date: string; start_time: string | null; end_time: string | null }[];
  price: { min: number; max: number } | null;
  venue: { name: string; address: string };
  sources: { name: string; type: string; url: string }[];
}

function processPrice(price: { min: number; max: number } | null): {
  is_free: boolean | null;
  price_min: number | null;
  price_max: number | null;
} {
  if (price === null) {
    return { is_free: null, price_min: null, price_max: null };
  }
  if (price.min === 0 && price.max === 0) {
    return { is_free: true, price_min: 0, price_max: 0 };
  }
  if (price.min > 0) {
    return { is_free: false, price_min: price.min, price_max: price.max };
  }
  return { is_free: null, price_min: null, price_max: null };
}

async function seedEvents() {
  const db = getDatabase();

  const dataPath = path.resolve(__dirname, './data/march_2026.json');
  console.log(`Reading from: ${dataPath}`);

  const data = await fs.readFile(dataPath, 'utf-8');
  const raw = JSON.parse(data) as { events: RawEvent[] };

  let insertedCount = 0;

  for (const rawEvent of raw.events) {
    const priceInfo = processPrice(rawEvent.price);

    for (const dateInfo of rawEvent.dates) {
      await db.insertInto('events').values({
        city: rawEvent.city,
        name: rawEvent.name,
        description: rawEvent.description,
        category: rawEvent.category,
        status: 'active',
        date: new Date(dateInfo.date),
        start_time: dateInfo.start_time,
        end_time: dateInfo.end_time,
        is_free: priceInfo.is_free,
        price_min: priceInfo.price_min,
        price_max: priceInfo.price_max,
        venue: rawEvent.venue.name,
        address: rawEvent.venue.address,
        audience: '[]' as any,
        sources: JSON.stringify(rawEvent.sources.map((s) => ({
          entity: s.name,
          type: s.type,
          url: s.url,
        }))) as any,
      }).execute();

      insertedCount++;
      console.log(`Inserted: ${rawEvent.name} - ${dateInfo.date}`);
    }
  }

  console.log(`\nTotal events inserted: ${insertedCount}`);

  await db.destroy();
}

seedEvents()
  .then(() => {
    console.log('Seed completed successfully');
    process.exit(0);
  })
  .catch((err) => {
    console.error('Seed failed:', err);
    process.exit(1);
  });
