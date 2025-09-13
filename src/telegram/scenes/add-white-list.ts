import {Markup, Scenes} from "telegraf"
import {AppContext} from "telegram/types/session/AppContext"
import {match} from "telegram/match/match"

export const addWhiteListScene = new Scenes.BaseScene<AppContext>("add-white-list-scene")

addWhiteListScene.enter(async ctx => {
  return ctx.reply(
    ctx.i18n.t("add_white_list.message"),
    Markup.keyboard([[ctx.i18n.t("other.back")]]).resize()
  )
})

addWhiteListScene.on("text", async ctx => {
  await ctx.reply(ctx.i18n.t("add_white_list.success"))

  return ctx.scene.enter("navigation-scene")
})

addWhiteListScene.hears(match("other.back"), async ctx => {
  return ctx.scene.enter("navigation-scene")
})
