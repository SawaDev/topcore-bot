import {Markup, Scenes} from "telegraf"
import {AppContext} from "telegram/types/session/AppContext"
import {match} from "telegram/match/match"

export const removeWhiteListScene = new Scenes.BaseScene<AppContext>("remove-white-list-scene")

removeWhiteListScene.enter(async ctx => {
  return ctx.reply(
    ctx.i18n.t("remove_white_list.message"),
    Markup.keyboard([[ctx.i18n.t("other.back")]]).resize()
  )
})

removeWhiteListScene.on("text", async ctx => {
  await ctx.reply(ctx.i18n.t("remove_white_list.success"))

  return ctx.scene.enter("navigation-scene")
})

removeWhiteListScene.hears(match("other.back"), async ctx => {
  return ctx.scene.enter("navigation-scene")
})
