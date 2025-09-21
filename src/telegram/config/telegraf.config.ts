import {NarrowedContext, Telegraf} from "telegraf"
import {Update} from "typegram"
import {AppContext} from "telegram/types/session/AppContext"
import moment from "moment"
import "moment-timezone"
import generalCache from "telegram/lib/general-cache"

// Выбор языка
moment.locale("ru")
// Выбор региона
moment.tz.setDefault("Asia/Tashkent")
const TELEGRAM_ENABLED = (process.env.TELEGRAM_ENABLED ?? "true") !== "false"
// Токен бота
const rawToken = process.env.BOT_TOKEN
// Используем фиктивный токен когда Telegram отключён, чтобы не падали импорты
const token: string = rawToken ?? "000000:disabled"

// Если Telegram включён, но токен не задан — падаем с ошибкой
if (TELEGRAM_ENABLED && rawToken == undefined) {
    throw new Error("BOT_TOKEN must be provided when TELEGRAM_ENABLED is not false!")
}

export class CustomContext extends generalCache.context {
}

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
export const bot = new Telegraf<AppContext>(token, {contextType: CustomContext})
export const telegramEnabled = TELEGRAM_ENABLED

export type AppMatchedContext = NarrowedContext<AppContext & {match: RegExpExecArray}, Update.CallbackQueryUpdate>
export type AppMatchedContextText = NarrowedContext<AppContext & {match: RegExpExecArray}, Update.MessageUpdate>
