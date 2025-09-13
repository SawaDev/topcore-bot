import {Context} from "telegraf"
import generalCache, {GeneralCacheProps} from "telegram/lib/general-cache/index"

export class GeneralCacheContext extends Context {
    generalCache: GeneralCacheProps = generalCache.initCache
}

