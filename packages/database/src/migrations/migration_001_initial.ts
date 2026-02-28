import { Kysely, Migration } from 'kysely';

export const migration_001_initial: Migration = {
  up: (db: Kysely<any>) => {
    return db.schema
      .createTable('events')
      .addColumn('id', 'uuid', (col) => col.primaryKey())
      .addColumn('title', 'varchar(255)', (col) => col.notNull())
      .addColumn('description', 'text', (col) => col)
      .addColumn('location', 'varchar(255)', (col) => col)
      .addColumn('start_date', 'timestamptz', (col) => col.notNull())
      .addColumn('end_date', 'timestamptz', (col) => col)
      .addColumn('category', 'varchar(50)', (col) => col.notNull())
      .addColumn('image_url', 'varchar(500)', (col) => col)
      .addColumn('created_at', 'timestamptz', (col) => col.notNull().defaultTo('now()'))
      .addColumn('updated_at', 'timestamptz', (col) => col.notNull().defaultTo('now()'))
      .execute();
  },
  down: (db: Kysely<any>) => {
    return db.schema.dropTable('events').execute();
  },
};
