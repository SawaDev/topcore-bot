import "module-alias/register"
import "dotenv/config"
import {bot} from "telegram/config/telegraf.config"
import express from "express"
import apiRoutes from "routes/api"
import clc from "cli-color"
import {secretPath} from "telegram/bot"
import errorConfig from "config/error.config"
import {corsConfig} from "config/cors.config"

// Создание
const app = express()
//
app.use(corsConfig)
//
app.use(express.json({limit: "50mb"}))
app.use(express.urlencoded({extended: false}))
// Установите конечную точку API бота
app.use(bot.webhookCallback(secretPath))
// Обычные api
app.use("/api", apiRoutes)
// Api для, телеграмма

// Отслеживание ошибок
app.use(errorConfig.logErrors)
app.use(errorConfig.clientErrorHandler)
app.use(errorConfig.errorHandler)

// Запуск сервера
export const server = app.listen(process.env.WEBHOOK_PORT, () => {
    console.log(clc.bgGreenBright(`Webhook listening on port ${process.env.WEBHOOK_PORT}!`))
})

export default app
