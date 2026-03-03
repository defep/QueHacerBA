import { Kysely, PostgresDialect } from 'kysely';
import pg from 'pg';

const { Pool } = pg;

export interface Database {
  events: {
    id?: string;
    city: string;
    name: string;
    description: string | null;
    category: string;
    status: string;
    date: Date;
    start_time: string | null;
    end_time: string | null;
    is_free: boolean | null;
    price_min: number | null;
    price_max: number | null;
    venue: string | null;
    address: string | null;
    audience: string[];
    sources: { entity: string; type: string; url: string }[];
    created_at?: Date;
    updated_at?: Date;
  };
}

let dbInstance: Kysely<Database> | undefined;

export function getDatabase(): Kysely<Database> {
  if (!dbInstance) {
    const pool = new Pool({
      host: process.env.DB_HOST ?? 'localhost',
      port: parseInt(process.env.DB_PORT ?? '5432'),
      database: process.env.DB_NAME ?? 'quehacerba',
      user: process.env.DB_USER ?? 'postgres',
      password: process.env.DB_PASSWORD ?? 'postgres',
      max: 10,
    });

    dbInstance = new Kysely<Database>({
      dialect: new PostgresDialect({
        pool,
      }),
    });
  }

  return dbInstance;
}

export const db = getDatabase();
