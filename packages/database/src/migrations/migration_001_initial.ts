import { Kysely, Migration } from 'kysely';

export const migration_001_initial: Migration = {
  up: (db: Kysely<any>) => {
    return db.schema
      .createTable('events')
      .addColumn('id', 'uuid', (col) => col.primaryKey().defaultTo('gen_random_uuid()'))
      .addColumn('city', 'varchar(100)', (col) => col.notNull())
      .addColumn('name', 'varchar(255)', (col) => col.notNull())
      .addColumn('description', 'text', (col) => col)
      .addColumn('category', 'varchar(50)', (col) => col.notNull())
      .addColumn('status', 'varchar(20)', (col) => col.defaultTo('active'))
      .addColumn('date', 'date', (col) => col.notNull())
      .addColumn('start_time', 'time', (col) => col)
      .addColumn('end_time', 'time', (col) => col)
      .addColumn('is_free', 'boolean', (col) => col)
      .addColumn('price_min', 'numeric', (col) => col)
      .addColumn('price_max', 'numeric', (col) => col)
      .addColumn('venue', 'varchar(255)', (col) => col)
      .addColumn('address', 'text', (col) => col)
      .addColumn('audience', 'jsonb', (col) => col.defaultTo('[]'))
      .addColumn('sources', 'jsonb', (col) => col.defaultTo('[]'))
      .addColumn('created_at', 'timestamptz', (col) => col.notNull().defaultTo('now()'))
      .addColumn('updated_at', 'timestamptz', (col) => col.notNull().defaultTo('now()'))
      .execute();
  },
  down: (db: Kysely<any>) => {
    return db.schema.dropTable('events').execute();
  },
};
