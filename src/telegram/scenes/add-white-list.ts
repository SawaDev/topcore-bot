import {Markup, Scenes} from "telegraf"
import {AppContext} from "telegram/types/session/AppContext"
import {match} from "telegram/match/match"
import {db} from "db"

export const addWhiteListScene = new Scenes.BaseScene<AppContext>("add-white-list-scene")

addWhiteListScene.enter(async ctx => {
  return ctx.reply(
    ctx.i18n.t("add_white_list.message"),
    Markup.keyboard([[ctx.i18n.t("other.back")]]).resize()
  )
})

addWhiteListScene.hears(match("other.back"), async ctx => {
  return ctx.scene.enter("navigation-scene")
})

addWhiteListScene.on("text", async ctx => {
  const text = (ctx.message as any).text?.trim()
  const account = text?.replace(/\D/g, "")
  if (!account || account.length < 5) {
    return ctx.reply(ctx.i18n.t("add_white_list.invalid"))
  }

  const existing = await db("abonents").where({account_number: account}).first()
  if (!existing) {
    return ctx.reply(ctx.i18n.t("add_white_list.not_found"))
  }

  if (existing.is_white_listed) {
    return ctx.reply(ctx.i18n.t("add_white_list.already"))
  }

  await db("abonents").where({id: existing.id}).update({is_white_listed: true})

  await ctx.reply(ctx.i18n.t("add_white_list.success"))
  return ctx.scene.enter("navigation-scene")
})
