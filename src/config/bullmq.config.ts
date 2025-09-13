import {QueueOptions} from "bull"

export const bullOptions: QueueOptions = {
    redis: {
        host: process.env.REDIS_HOST,
        port: Number(process.env.REDIS_PORT)
    },
    defaultJobOptions: {
        removeOnComplete: true,
        delay: 1000,
        timeout: 5000
    },
    limiter: {
        max: 1000,
        duration: 5000
    }
}
