import {AppContext} from "telegram/types/session/AppContext"
import {initRedisSession} from "telegram/config/redis/redis-session.config"

/**
 * Промежуточное ПО для redis
 * @param ctx
 * @param next
 */
export const redisSessionMiddleware = (ctx: AppContext, next: () => void) => {
    // Если не установлен
    ctx.session = Object.assign(JSON.parse(JSON.stringify(initRedisSession)), ctx.session)
    // Токен пользователя
    // ctx.rsession.token = ctx.rsession.token || undefined
    // Выбранный город
    // ctx.rsession.selectCityId = ctx.rsession.selectCityId || undefined

    // Выбрать значения
    ctx.getRedis = (key) => {
        return ctx.session[key]
    }
    // Установить значения
    ctx.setRedis = (key, val) => {
        return ctx.session[key] = val
    }
    return next()
}
