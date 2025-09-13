import {generalCacheRedisSessionConfig} from "telegram/lib/general-cache/general-cache.config"
import {generalCacheMiddleware} from "telegram/lib/general-cache/general-cache.middleware"
import {GeneralCacheContext} from "telegram/lib/general-cache/general-cache.context"

export interface GeneralCacheProps {}

export interface ContextGeneralCacheProps {
    // Кеширование
    generalCache: GeneralCacheProps
}

const initGeneralCache: GeneralCacheProps = {}

export default {
    config: generalCacheRedisSessionConfig,
    middleware: generalCacheMiddleware,
    initCache: initGeneralCache,
    context: GeneralCacheContext
}
