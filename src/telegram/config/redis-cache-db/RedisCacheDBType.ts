export type RedisCacheDBType = {
    // За кешированные сообщения
    cacheMessages: Record<string, any>
    raffleTimestamps: number | null
}
