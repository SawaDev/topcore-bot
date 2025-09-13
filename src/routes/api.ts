import express, {Request, Response} from "express"
import {bot} from "telegram/config/telegraf.config"

const router = express.Router()

// Проверка статуса webhook
router.get("/", async (req: Request, res: Response) => {
    try {
        const webhookInfo = await bot.telegram.getWebhookInfo()
        if (webhookInfo.url === "")
            return res.status(500).send({message: "error"})
        return res.send(webhookInfo)
    } catch (e: any) {
        return res.status(500).send({message: e.message})
    }
})

export default router
