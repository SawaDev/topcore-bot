import { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  await knex.schema.alterTable("abonents", (t) => {
    t.timestamp("created_at", { useTz: true }).notNullable().defaultTo(knex.fn.now());
    t.timestamp("updated_at", { useTz: true }).notNullable().defaultTo(knex.fn.now());
  });

  await knex.schema.alterTable("abonent_balances", (t) => {
    t.timestamp("created_at", { useTz: true }).notNullable().defaultTo(knex.fn.now());
    t.timestamp("updated_at", { useTz: true }).notNullable().defaultTo(knex.fn.now());
  });

  await knex.raw(`
    CREATE OR REPLACE FUNCTION set_updated_at() RETURNS TRIGGER AS $$
    BEGIN
      NEW.updated_at = NOW();
      RETURN NEW;
    END;
    $$ LANGUAGE plpgsql;
  `);

  await knex.raw(`
    DROP TRIGGER IF EXISTS set_abonents_updated_at ON abonents;
    CREATE TRIGGER set_abonents_updated_at
    BEFORE UPDATE ON abonents
    FOR EACH ROW EXECUTE FUNCTION set_updated_at();
  `);

  await knex.raw(`
    DROP TRIGGER IF EXISTS set_abonent_balances_updated_at ON abonent_balances;
    CREATE TRIGGER set_abonent_balances_updated_at
    BEFORE UPDATE ON abonent_balances
    FOR EACH ROW EXECUTE FUNCTION set_updated_at();
  `);
}

export async function down(knex: Knex): Promise<void> {
  await knex.raw(`DROP TRIGGER IF EXISTS set_abonent_balances_updated_at ON abonent_balances;`);
  await knex.raw(`DROP TRIGGER IF EXISTS set_abonents_updated_at ON abonents;`);
  await knex.raw(`DROP FUNCTION IF EXISTS set_updated_at();`);

  await knex.schema.alterTable("abonent_balances", (t) => {
    t.dropColumns("created_at", "updated_at");
  });

  await knex.schema.alterTable("abonents", (t) => {
    t.dropColumns("created_at", "updated_at");
  });
}


