import {Markup, Scenes} from "telegraf"
import {AppContext} from "telegram/types/session/AppContext"
import axios from "axios"
import * as XLSX from "xlsx"
import fs from "fs"
import path from "path"
import {match} from "telegram/match/match"
import {AbonentRow} from "telegram/types/UploadFile"
import {db} from "db"

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

    const rows = data.slice(1) as AbonentRow[]

    //extract prefix
    const prefix = rows[0]["Номер кадастра"].split(":").slice(0, -1).join(":")

    const [upload] = await db("uploads").insert({prefix}).returning("*")

    for (const r of rows) {
      const [abonent] = await db("abonents")
        .insert({
          upload_id: upload.id,
          account_number: r["Л/С"],
          cadastral_number: r["Номер кадастра"],
          full_name: r["ФИО абонента"],
          address: r["Адрес"],
          area: r["Общая площадь"]
        })
        .onConflict(["account_number", "cadastral_number"])
        .merge(["full_name", "address", "area"]) // do not touch phone here
        .returning("*")

      if (typeof r.phone !== "undefined" && r.phone !== abonent.phone) {
        await db("abonents").where({id: abonent.id}).update({phone: r.phone})
      }

      await db("abonent_balances").insert({
        abonent_id: abonent.id,
        start_balance: r["Сальдо на начало периода"],
        accrued: r["Начислено"],
        paid: r["Всего оплачено"],
        other_charges: r["Проче начисления(измененных салдо)"],
        end_balance: r["Сальдо на конец периода"]
      })
    }

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
