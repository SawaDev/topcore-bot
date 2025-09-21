import {Markup, Scenes} from "telegraf"
import {AppContext} from "telegram/types/session/AppContext"
import {match} from "telegram/match/match"
import {db} from "db"

export const searchAbonentScene = new Scenes.BaseScene<AppContext>("search-abonent-scene")

searchAbonentScene.enter(async ctx => {
  await ctx.reply(
    ctx.i18n.t("search_abonent.message"),
    Markup.keyboard([[ctx.i18n.t("other.back")]]).resize()
  )
})

type AbonentResult = {
  id: number
  account_number: number
  full_name: string | null
  phone: string | null
  address: string | null
  area: number | null
  end_balance: string | number | null
}

searchAbonentScene.hears(match("other.back"), async ctx => {
  return ctx.scene.enter("navigation-scene")
})

searchAbonentScene.on("text", async ctx => {
  const text = (ctx.message as any).text?.trim() || ""
  if (!text) return

  const digits = text.replace(/\D/g, "")
  const q = `%${text.toLowerCase()}%`
  const qDigits = `%${digits}%`
  const hasText = q !== "%%"
  const hasDigits = qDigits !== "%%"

  const latest = db("abonent_balances")
    .select("abonent_id")
    .max({created_at: "created_at"})
    .groupBy("abonent_id")

  const rows: AbonentResult[] = await db
    .with("latest", latest)
    .select("a.id", "a.account_number", "a.full_name", "a.phone", "a.address", "a.area", "lb.end_balance")
    .from({a: "abonents"})
    .leftJoin({lt: "latest"}, "lt.abonent_id", "a.id")
    .leftJoin({lb: "abonent_balances"}, function () {
      this.on("lb.abonent_id", "=", "a.id").andOn("lb.created_at", "=", "lt.created_at")
    })
    .where(builder => {
      if (hasText) {
        builder
          .orWhereRaw("LOWER(a.full_name) LIKE ?", [q])
          .orWhereRaw("LOWER(a.address) LIKE ?", [q])
      }
      if (hasDigits) {
        builder
          .orWhereRaw("a.account_number::text LIKE ?", [qDigits])
          .orWhereRaw("a.phone LIKE ?", [qDigits])
      }
    })
    .orderBy("a.account_number", "asc")
    .limit(50)

  if (!rows.length) {
    return ctx.reply(ctx.i18n.t("search_abonent.empty"))
  }

  const header = ctx.i18n.t("search_abonent.current")
  const lines = rows.map(r => {
    const parts: string[] = []
    parts.push(`L/S: ${r.account_number}${r.full_name ? ` — ${r.full_name}` : ""}`)
    if (r.phone) parts.push(`Tel: ${r.phone}`)
    if (r.address) parts.push(`Manzil: ${r.address}`)
    const bal =
      r.end_balance != null
        ? typeof r.end_balance === "number"
          ? r.end_balance
          : Number(r.end_balance)
        : null
    if (bal != null && !Number.isNaN(bal)) parts.push(`Qarzdorlik: ${bal.toLocaleString("fr-FR")}`)
    if (r.area != null) parts.push(`Maydon: ${r.area}`)
    return parts.join("\n")
  })

  return ctx.reply([header, ...lines].join("\n\n"))
})
