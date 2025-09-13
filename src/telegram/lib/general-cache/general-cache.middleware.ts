import {AppContext} from "telegram/types/session/AppContext"
import generalCache from "telegram/lib/general-cache/index"

export const generalCacheMiddleware = (ctx: AppContext, next: () => void) => {
    ctx.generalCache = Object.assign(JSON.parse(JSON.stringify(generalCache.initCache)), ctx.generalCache)
    return next()
}
