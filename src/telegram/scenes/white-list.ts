import {Markup, Scenes} from "telegraf"
import {AppContext} from "telegram/types/session/AppContext"
import {match} from "telegram/match/match"
import {db} from "db"

export const whiteListScene = new Scenes.BaseScene<AppContext>("white-list-scene")

whiteListScene.enter(async ctx => {
  await ctx.reply(
    ctx.i18n.t("white_list.message"),
    Markup.keyboard([
      [ctx.i18n.t("white_list.add"), ctx.i18n.t("white_list.remove")],
      [ctx.i18n.t("other.back")]
    ]).resize()
  )

  const rows = await db("abonents")
    .select(["account_number", "full_name"]) 
    .where({is_white_listed: true})
    .orderBy("account_number", "asc")
    .limit(100)

  if (!rows.length) {
    return ctx.reply(ctx.i18n.t("white_list.empty"))
  }

  const lines = rows.map(r => `L/S: ${r.account_number}${r.full_name ? ` — ${r.full_name}` : ""}`)
  return ctx.reply([ctx.i18n.t("white_list.current"), "", ...lines].join("\n"))
})

whiteListScene.hears(match("white_list.add"), async ctx => {
  return ctx.scene.enter("add-white-list-scene")
})

whiteListScene.hears(match("white_list.remove"), async ctx => {
  return ctx.scene.enter("remove-white-list-scene")
})

whiteListScene.hears(match("other.back"), async ctx => {
  return ctx.scene.enter("navigation-scene")
})
