require("ts-node").register();
const allConfigs = require("./src/telegram/config/knexfile.config.ts").default;
const env = process.env.KNEX_ENV || process.env.NODE_ENV || "development";
module.exports = allConfigs[env] || allConfigs.development;
