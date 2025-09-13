import RedisSession from "telegraf-session-redis"
import {RedisCacheDBType} from "telegram/config/redis-cache-db/RedisCacheDBType"
import process from "process"

// Подключение к Redis для, сохранение сессии
export const redisCacheDB = new RedisSession({
    property: "db",
    getSessionKey: (ctx) => ctx.from && ctx.chat && (process.env.REDIS_PREFIX_DB || "") + `db-${ctx.from.id}:${ctx.chat.id}`,
    ttl: 14400,
    // ttl: 604800,
    // ttl: 10,
    store: {
        host: process.env.REDIS_HOST || "127.0.0.1",
        port: process.env.REDIS_PORT || "6379"
    }

})

export const initRedisCacheDB: RedisCacheDBType = {
    cacheMessages: new Map(),
    raffleTimestamps: null
}
