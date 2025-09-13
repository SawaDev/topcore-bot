import {Scenes} from "telegraf"
import {AppContext} from "telegram/types/session/AppContext"

export const informAboutDebtScene = new Scenes.BaseScene<AppContext>("inform-about-debt-scene")

informAboutDebtScene.enter(async ctx => {
  await ctx.reply(ctx.i18n.t("inform_about_debt.message"))

  setTimeout(async () => {
    await ctx.reply(ctx.i18n.t("inform_about_debt.success"))
  }, 5000)

  return ctx.scene.enter("navigation-scene")
})
