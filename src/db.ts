import knex from "knex";
import allConfigs from "telegram/config/knexfile.config";

const env = process.env.KNEX_ENV || process.env.NODE_ENV || "development";
const knexConfig = (allConfigs as any)[env] || (allConfigs as any).development;

export const db = knex(knexConfig);
