import {Markup, Scenes} from "telegraf"
import {AppContext} from "telegram/types/session/AppContext"
import axios from "axios"
import * as XLSX from "xlsx"
import fs from "fs"
import path from "path"
import { match } from "telegram/match/match"

const dataDir = path.join(__dirname, "../../../data")
fs.mkdirSync(dataDir, {recursive: true})

export const uploadFileScene = new Scenes.BaseScene<AppContext>("upload-file-scene")

uploadFileScene.enter(async ctx => {
  return ctx.reply(ctx.i18n.t("upload_file.message"), Markup.keyboard([[ctx.i18n.t("other.back")]]).resize())
})

uploadFileScene.on("document", async ctx => {
  try {
    const fileId = ctx.message.document.file_id

    // Get file link from Telegram
    const fileLink = await ctx.telegram.getFileLink(fileId)

    // Download file as buffer
    const response = await axios.get(fileLink.href, {responseType: "arraybuffer"})
    const buffer = Buffer.from(response.data)

    // Parse Excel file
    const workbook = XLSX.read(buffer, {type: "buffer"})
    const sheetName = workbook.SheetNames[0] // first sheet
    const sheet = workbook.Sheets[sheetName]

    // Convert to JSON
    const data = XLSX.utils.sheet_to_json(sheet)

    const files = fs.readdirSync(dataDir).filter(f => f.endsWith(".json"))
    const nextId = files.length + 1
    const filePath = path.join(dataDir, `${nextId}.json`)

    // Save JSON to file
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2), "utf-8")

    await ctx.reply(ctx.i18n.t("upload_file.success"))
    
    return ctx.scene.enter("navigation-scene")
  } catch (err) {
    console.error(err)
    await ctx.reply(ctx.i18n.t("upload_file.error"))

    return ctx.scene.enter("navigation-scene")
  }
})

uploadFileScene.hears(match("other.back"), async ctx => {
  return ctx.scene.enter("navigation-scene")
})