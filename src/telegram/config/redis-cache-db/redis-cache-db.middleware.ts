import {AppContext} from "telegram/types/session/AppContext"
import {initRedisCacheDB} from "telegram/config/redis-cache-db"

/**
 * Промежуточное ПО для redis
 * @param ctx
 * @param next
 */
export const redisCacheDbMiddleware = (ctx: AppContext, next: () => void) => {
    // Если не установлен
    ctx.db = Object.assign(JSON.parse(JSON.stringify(initRedisCacheDB)), ctx.db)
    return next()
}
