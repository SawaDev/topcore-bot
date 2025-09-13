import {Markup, Scenes} from "telegraf"
import {AppContext} from "telegram/types/session/AppContext"
import {match} from "telegram/match/match"

export const blackListScene = new Scenes.BaseScene<AppContext>("black-list-scene")

blackListScene.enter(async ctx => {
  await ctx.reply(ctx.i18n.t("black_list.message"), Markup.keyboard([[ctx.i18n.t("other.back")]]).resize())

  await ctx.reply(
    "Qora ro'yxatdagilar:\n\nMijoz 1:\nL/S: 1234567890\n\nMijoz 2:\nL/S: 1234567891\n\nMijoz 3:\nL/S: 1234567892"
  )
})

blackListScene.hears(match("other.back"), async ctx => {
  return ctx.scene.enter("navigation-scene")
})
