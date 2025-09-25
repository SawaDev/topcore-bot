import {createLogger, format, transports} from "winston"

// Форматы
const {combine, timestamp, prettyPrint} = format

const createSettings = path => ({
    level: "info",
    format: combine(
        timestamp({
            format: "YYYY-MM-DD HH:mm:ss"
        }),
        prettyPrint()
    ),
    transports: [
        new transports.Console(),
        new transports.File({filename: path, level: "error"})
        // new transports.File({filename: path, level: "info"})
    ]
})

// Создания лога
export const logger = createLogger({
    level: "info",
    format: combine(
        timestamp({
            format: "YYYY-MM-DD HH:mm:ss"
        }),
        prettyPrint()
    ),
    transports: [
        new transports.Console(),
        new transports.File({filename: "logs/error.log", level: "error"})
    ]
})

export const expressLogger = createLogger(createSettings("logs/express.error.log"))

export const playmobileLogger = createLogger({
    level: "info",
    format: combine(
        timestamp({
            format: "YYYY-MM-DD HH:mm:ss"
        }),
        prettyPrint()
    ),
    transports: [
        new transports.File({filename: "logs/playmobile.log", level: "info"})
    ]
})

export const loggerState = async (ctx, next) => {
    ctx.logger = async (e, ctx) => {
        if (e?.message) logger.error({message: e?.message, file: e?.file, stack: e.stack})
    }
    return next()
}