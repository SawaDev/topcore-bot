import {AppContext} from "telegram/types/session/AppContext"

type IsNotMatchType = (keys: string[]) => (text: string, ctx: AppContext) => any | null

/**
 * Выбрать кроме keys
 * @param keys
 */
export const isNotMatch: IsNotMatchType = (keys) => {
    return (text, ctx) => {
        if (text && ctx && ctx.i18n) {
            const regexCommand = new RegExp(/(^(\/)[a-z]*)/)
            if (keys.some(key => text.replaceAll("/", "")?.includes(ctx.i18n.t(key))) || regexCommand.test(text))
                return null
            return [text]
        }
        return null
    }
}
