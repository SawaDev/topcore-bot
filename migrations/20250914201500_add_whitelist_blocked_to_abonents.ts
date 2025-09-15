import {Knex} from "knex"

export async function up(knex: Knex): Promise<void> {
  await knex.schema.alterTable("abonents", t => {
    t.boolean("is_white_listed").notNullable().defaultTo(false).index()
    t.boolean("is_blocked").notNullable().defaultTo(false).index()
  })
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.alterTable("abonents", t => {
    t.dropColumns("is_white_listed", "is_blocked")
  })
}


