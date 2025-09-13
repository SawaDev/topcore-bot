import RedisSession from "telegraf-session-redis"
import {CustomSessionType} from "telegram/config/redis/RedisSessionType"
import * as process from "process"

// Подключение к Redis для, сохранение сессии
export const redisSession = new RedisSession({
    getSessionKey: (ctx) => ctx.from && ctx.chat && (process.env.REDIS_PREFIX_DB || "") + `${ctx.from.id}:${ctx.chat.id}`,
    store: {
        host: process.env.REDIS_HOST || "127.0.0.1",
        port: process.env.REDIS_PORT || 6379
    }
})

export const initRedisSession: CustomSessionType = {
    token: undefined,
}
