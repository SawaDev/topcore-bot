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
// Токен бота
const token = process.env.BOT_TOKEN

// Если не существует токена
if (token == undefined)
    throw new Error("BOT_TOKEN must be provided!")

export class CustomContext extends generalCache.context {
}

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
export const bot = new Telegraf<AppContext>(token, {contextType: CustomContext})

export type AppMatchedContext = NarrowedContext<AppContext & {match: RegExpExecArray}, Update.CallbackQueryUpdate>
export type AppMatchedContextText = NarrowedContext<AppContext & {match: RegExpExecArray}, Update.MessageUpdate>
