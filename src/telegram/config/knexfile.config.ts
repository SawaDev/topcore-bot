import type {Knex} from "knex"
import dotenv from "dotenv"

dotenv.config()

const DEFAULT_POOL = {min: 2, max: 10} as const
const DEFAULT_MIGRATIONS = {
  directory: "./migrations",
  extension: "ts"
} as const

const config: {[key: string]: Knex.Config} = {
  development: {
    client: "pg",
    connection: {
      host: process.env.DB_HOST ?? "localhost",
      port: process.env.DB_PORT ? Number(process.env.DB_PORT) : 5432,
      user: process.env.DB_USER ?? "doadmin",
      password: process.env.DB_PASSWORD ?? "",
      database: process.env.DB_NAME ?? "development",
      ssl: {rejectUnauthorized: false}
    },
    pool: DEFAULT_POOL,
    migrations: DEFAULT_MIGRATIONS
  },
  production: {
    client: "pg",
    connection: {
      host: process.env.DB_HOST ?? "localhost",
      port: process.env.DB_PORT ? Number(process.env.DB_PORT) : 5432,
      user: process.env.DB_USER ?? "doadmin",
      password: process.env.DB_PASSWORD ?? "",
      database: process.env.DB_NAME ?? "production",
      ssl: {rejectUnauthorized: false}
    },
    pool: DEFAULT_POOL,
    migrations: DEFAULT_MIGRATIONS
  }
}

export default config
