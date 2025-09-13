import { cacheMessagesMiddleware } from "telegram/config/cache-messages/cache-messages.middleware"
import { loggerState } from "telegram/config/logger.config"
import { bot } from "telegram/config/telegraf.config"
import { i18n } from "telegram/config/language/i18n.config"
import { redisSession } from "telegram/config/redis/redis-session.config"
import { scenesStage } from "telegram/config/scenes.config"
import { redisSessionMiddleware } from "telegram/config/redis/redis-session.middleware"
import { redisCacheDbMiddleware } from "telegram/config/redis-cache-db/redis-cache-db.middleware"
import { redisCacheDB } from "telegram/config/redis-cache-db"
import rateLimit from "telegraf-ratelimit"
import generalCache from "telegram/lib/general-cache"
import { checkNotGroupMiddleware } from "telegram/middleware/checkNotGroup.middleware"

// Создание секретного пути
export const secretPath = `/telegraf/${bot.secretPathComponent()}`

bot.use(checkNotGroupMiddleware)
// bot.use(sceneTransitionMiddleware)
bot.use(generalCache.config)
bot.use(generalCache.middleware)
bot.use(redisSession)
bot.use(redisCacheDB)
bot.use(redisSessionMiddleware)
bot.use(redisCacheDbMiddleware)
bot.use(loggerState)
bot.use(cacheMessagesMiddleware)
bot.use(i18n.middleware())
bot.use(scenesStage.middleware())
bot.use(rateLimit({
    window: 500,
    limit: 1,
    onLimitExceeded: (ctx) => {
        ctx.reply(ctx.i18n.t("error.rate_limit"))
    }
}))

// Запуск пользователем
bot.start(async (ctx) => {
    await ctx.reply(ctx.i18n.t("hello"))

    await ctx.reply(ctx.i18n.t("enter_message"))

    return ctx.scene.enter("navigation-scene")
})

bot.on("text", async (ctx) => {
    if (!ctx.scene.current) {
        return ctx.scene.enter("branches-scene")
    }
})

    // Запуск бота
    ; (async () => {
        if (process.env.WEBHOOK_DOMAIN)
            await bot.telegram.setWebhook(`${process.env.WEBHOOK_DOMAIN}${secretPath}`)
        else
            await bot.launch()
    })()

// Вывод ошибки бота
bot.catch(async (e: any, ctx) => {
    // Вывод в консоль
    if (process.env.NODE_ENV === "development" && e.stack) console.log(e.stack)
    // Сохранение логов
    if (e?.response?.error_code && ctx.logger) {
        ctx.logger && await ctx.logger(e, ctx)
    }
})

// Завершение бота
process.once("SIGINT", () => bot.stop("SIGINT"))
process.once("SIGTERM", () => bot.stop("SIGTERM"))

export default bot
