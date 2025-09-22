import {Markup, Scenes} from "telegraf"
import {match} from "telegram/match/match"
import {AppContext} from "telegram/types/session/AppContext"

export const navigationScene = new Scenes.BaseScene<AppContext>("navigation-scene")

//start
navigationScene.enter(async ctx => {
  const keyboard = Markup.keyboard([
    [ctx.i18n.t("navigation.upload_file")],
    [ctx.i18n.t("navigation.inform_about_debt"), ctx.i18n.t("navigation.search_abonent")],
    [ctx.i18n.t("navigation.black_list"), ctx.i18n.t("navigation.white_list")]
  ]).resize()

  return ctx.reply(ctx.i18n.t("navigation.start"), keyboard)
})

navigationScene.hears(match("navigation.upload_file"), async ctx => {
  return ctx.scene.enter("upload-file-scene")
})

navigationScene.hears(match("navigation.inform_about_debt"), async ctx => {
  return ctx.scene.enter("inform-about-debt-scene")
})

navigationScene.hears(match("navigation.search_abonent"), async ctx => {
  return ctx.scene.enter("search-abonent-scene")
})

navigationScene.hears(match("navigation.black_list"), async ctx => {
  return ctx.scene.enter("black-list-scene")
})

navigationScene.hears(match("navigation.white_list"), async ctx => {
  return ctx.scene.enter("white-list-scene")
})
