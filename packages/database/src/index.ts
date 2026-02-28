import { Kysely, PostgresDialect } from 'kysely';
import pg from 'pg';

const { Pool } = pg;

export interface Database {
  events: {
    id: string;
    title: string;
    description: string | null;
    location: string | null;
    start_date: Date;
    end_date: Date | null;
    category: string;
    image_url: string | null;
    created_at: Date;
    updated_at: Date;
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
