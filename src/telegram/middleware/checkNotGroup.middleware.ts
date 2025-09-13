import {AppContext} from "telegram/types/session/AppContext"

type CheckNotGroupMiddlewareType = (ctx: AppContext, next: () => void) => Promise<void | null>

/**
 * Проверяет с группы было отправлено сообщение
 * @param ctx
 * @param next
 */
export const checkNotGroupMiddleware: CheckNotGroupMiddlewareType = async (ctx, next) => {
    if (ctx.chat && ctx.chat.id > 0) return next()
    return null
}
