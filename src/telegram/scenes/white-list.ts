import {Markup, Scenes} from "telegraf"
import {AppContext} from "telegram/types/session/AppContext"
import {match} from "telegram/match/match"

export const whiteListScene = new Scenes.BaseScene<AppContext>("white-list-scene")

whiteListScene.enter(async ctx => {
  await ctx.reply(
    ctx.i18n.t("white_list.message"),
    Markup.keyboard([
      [ctx.i18n.t("white_list.add"), ctx.i18n.t("white_list.remove")],
      [ctx.i18n.t("other.back")]
    ]).resize()
  )

  return ctx.reply(
    "Ochiq ro'yxatdagilar:\n\nMijoz 1:\nL/S: 1234567890\n\nMijoz 2:\nL/S: 1234567891\n\nMijoz 3:\nL/S: 1234567892"
  )
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
