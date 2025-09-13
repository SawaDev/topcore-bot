import {AppContext} from "telegram/types/session/AppContext"

/**
 * Выбрать по ключу
 * @param resourceKey
 * @param templateData
 */
export const match = (resourceKey: string, templateData?: {[key: string]: string}): (text: string, ctx: AppContext) => RegExpExecArray | null => {
    return (text, ctx) => {
        try {
            if (text && ctx && ctx.i18n) {
                const regex = new RegExp(text)
                return regex.exec(ctx.i18n.t(resourceKey, templateData))
            }
            return null
        } catch (e) {
            return null
        }
    }
}
