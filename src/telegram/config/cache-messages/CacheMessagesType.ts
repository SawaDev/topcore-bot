// Кеширование сообщений
export interface CacheMessageType {
    removeCacheMessage: (key: string) => void
    setCacheMessage: (key: string, message: any) => void
    getCacheMessage: (key: string) => any[] | any
}
