import RedisSession from "telegraf-session-redis"
import process from "process"

// Подключение к Redis для, сохранение кэша
export const generalCacheRedisSessionConfig = new RedisSession({
    property: "generalCache",
    getSessionKey: () => (process.env?.REDIS_PREFIX_GENERAL_CACHE || "") + "general-cache",
    store: {
        host: process.env.REDIS_HOST || "127.0.0.1",
        port: process.env.REDIS_PORT || 6379
    }
})
