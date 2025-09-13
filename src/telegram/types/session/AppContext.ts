import {Scenes} from "telegraf"
import {RedisSessionMethodsType, RedisSessionType} from "telegram/config/redis/RedisSessionType"
import {CacheMessageType} from "telegram/config/cache-messages/CacheMessagesType"
import {LanguageType} from "telegram/config/language/LanguageType"
import {RedisCacheDBType} from "telegram/config/redis-cache-db/RedisCacheDBType"
import {ContextGeneralCacheProps} from "telegram/lib/general-cache"
import {GeneralCacheContext} from "telegram/lib/general-cache/general-cache.context"

// Контекст приложения
export interface CustomContext extends GeneralCacheContext {
    // Логирование
    logger: (e,ctx) => Promise<void>
    // Логирование
    syncLogger: (e) => void
    //
    db: RedisCacheDBType
    // Данные в кеше
    session: RedisSessionType
    // declare scene type
    scene: Scenes.SceneContextScene<AppContext, Scenes.WizardSessionData>
    // declare wizard type
    wizard: Scenes.WizardContextWizard<AppContext>
}

export type AppContext =
    CustomContext
    & CacheMessageType
    & ContextGeneralCacheProps
    & LanguageType
    & RedisSessionMethodsType
