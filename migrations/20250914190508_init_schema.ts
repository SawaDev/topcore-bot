import { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable("uploads", (t) => {
    t.increments("id").primary();
    t.string("prefix").notNullable();
    t.timestamp("uploaded_at").defaultTo(knex.fn.now());
  });

  await knex.schema.createTable("abonents", (t) => {
    t.increments("id").primary();
    t.integer("upload_id").notNullable().references("id").inTable("uploads").onDelete("CASCADE");
    t.bigInteger("account_number").notNullable().index();
    t.string("cadastral_number").notNullable().index();
    t.string("full_name");
    t.text("address");
    t.decimal("area", 10, 2);
    t.string("phone");
    t.unique(["account_number", "cadastral_number"]);
  });

  await knex.schema.createTable("abonent_balances", (t) => {
    t.increments("id").primary();
    t.integer("abonent_id").notNullable().references("id").inTable("abonents").onDelete("CASCADE");
    t.decimal("start_balance", 15, 2);
    t.decimal("accrued", 15, 2);
    t.decimal("paid", 15, 2);
    t.decimal("other_charges", 15, 2);
    t.decimal("end_balance", 15, 2);
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTableIfExists("abonent_balances");
  await knex.schema.dropTableIfExists("abonents");
  await knex.schema.dropTableIfExists("uploads");
}
