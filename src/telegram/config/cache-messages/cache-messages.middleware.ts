import {AppContext} from "telegram/types/session/AppContext"

export const cacheMessagesMiddleware = (ctx: AppContext, next: () => void) => {
    // Кеширование сообщений
    ctx.db.cacheMessages = ctx.db.cacheMessages || new Map()
    // Добавить сообщение в кеш
    ctx.setCacheMessage = (key, message) => {
        const cacheMessages = new Map(Object.entries(ctx.db.cacheMessages))
        cacheMessages.set(key, message)
        ctx.db.cacheMessages = Object.fromEntries(cacheMessages)
    }
    // Вывод сообщения из кеша
    ctx.getCacheMessage = (key) => {
        const cacheMessages = new Map(Object.entries(ctx.db.cacheMessages))
        return cacheMessages.get(key)
    }
    // Удаление сообщения из кеша
    ctx.removeCacheMessage = async (key) => {
        setTimeout(async () => {
            try {
                const cacheMessages = new Map(Object.entries(ctx.db.cacheMessages))
                const message: any = cacheMessages.get(key)
                if (Array.isArray(message))
                    await Promise.all(message.map(async m => m && m.message_id && await ctx.deleteMessage(m.message_id)))
                else
                    message && message.message_id && await ctx.deleteMessage(message.message_id)
                cacheMessages.delete(key)
                ctx.db.cacheMessages = Object.fromEntries(cacheMessages)
            } catch (e) {
                console.log(e)
                // ctx.syncLogger(e)
            }
        }, 200)
    }
    return next()
}
