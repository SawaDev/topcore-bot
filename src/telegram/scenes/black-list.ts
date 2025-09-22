import {Markup, Scenes} from "telegraf"
import {AppContext} from "telegram/types/session/AppContext"
import {match} from "telegram/match/match"
import {db} from "db"
import {replyLong} from "telegram/utils/replyLong"

export const blackListScene = new Scenes.BaseScene<AppContext>("black-list-scene")

blackListScene.enter(async ctx => {
  await ctx.reply(ctx.i18n.t("black_list.message"), Markup.keyboard([[ctx.i18n.t("other.back")]]).resize())

  const latest = db("abonent_balances")
    .select("abonent_id")
    .max({created_at: "created_at"})
    .groupBy("abonent_id")

  const rows = await db
    .with("latest", latest)
    .select("a.account_number", "a.full_name", "a.phone", "a.area", "lb.end_balance")
    .from({a: "abonents"})
    .leftJoin({lt: "latest"}, "lt.abonent_id", "a.id")
    .leftJoin({lb: "abonent_balances"}, function () {
      this.on("lb.abonent_id", "=", "a.id").andOn("lb.created_at", "=", "lt.created_at")
    })
    .whereRaw("(COALESCE(a.area, 0) * 3000 * 3) < COALESCE(lb.end_balance::numeric, 0)")
    .orderBy("a.account_number", "asc")
    .limit(100)

  if (!rows.length) {
    return ctx.reply(ctx.i18n.t("black_list.empty"))
  }

  const lines = rows.map(
    (r, index) =>
      `${index + 1}. L/S: ${r.account_number}${r.full_name ? ` — ${r.full_name}` : ""}${r.phone ? ` — ${r.phone}` : ""} ${
        r?.end_balance ? `\nAbonent qarzi: ${r.end_balance.toLocaleString("fr-FR")}` : ""
      }`
  )
  return replyLong(ctx, [ctx.i18n.t("black_list.current"), "", ...lines].join("\n"))
})

blackListScene.hears(match("other.back"), async ctx => {
  return ctx.scene.enter("navigation-scene")
})
