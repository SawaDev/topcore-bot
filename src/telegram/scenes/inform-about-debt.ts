import {Markup, Scenes} from "telegraf"
import {AppContext} from "telegram/types/session/AppContext"
import {db} from "db"
import {api} from "utils/api"
import {match} from "telegram/match/match"

export const informAboutDebtScene = new Scenes.BaseScene<AppContext>("inform-about-debt-scene")

type Debtor = {
  id: number
  account_number: number
  full_name: string | null
  phone: string | null
  area: number | null
  end_balance: string | number | null
}

async function getDebtors(): Promise<Debtor[]> {
  const latest = db("abonent_balances")
    .select("abonent_id")
    .max({created_at: "created_at"})
    .groupBy("abonent_id")

  const rows: Debtor[] = await db
    .with("latest", latest)
    .select(
      "a.id",
      "a.account_number",
      "a.full_name",
      "a.phone",
      "a.area",
      "lb.end_balance"
    )
    .from({a: "abonents"})
    .leftJoin({lt: "latest"}, "lt.abonent_id", "a.id")
    .leftJoin({lb: "abonent_balances"}, function () {
      this.on("lb.abonent_id", "=", "a.id").andOn("lb.created_at", "=", "lt.created_at")
    })
    .where("a.is_white_listed", false)
    .whereRaw("(COALESCE(a.area, 0) * 3000) <= COALESCE(lb.end_balance::numeric, 0)")
    .orderBy("a.account_number", "asc")

  return rows
}

async function sendSms(to: string, text: string): Promise<void> {
  try {
    await api.post("/sms/send", {to, text})
  } catch (e) {
    console.error("SMS send error", to, e)
  }
}

async function sendThreeMessages(phone: string, ctx: AppContext): Promise<void> {
  const msgs = [
    ctx.i18n.t("inform_about_debt.sms1"),
    ctx.i18n.t("inform_about_debt.sms2"),
    ctx.i18n.t("inform_about_debt.sms3")
  ]
  // for (const m of msgs) {
  //   await sendSms(phone, m)
  // }
}

informAboutDebtScene.enter(async ctx => {
  const debtors = await getDebtors()

  if (!debtors.length) {
    await ctx.reply(ctx.i18n.t("inform_about_debt.no_debtors"))
    return ctx.scene.enter("navigation-scene")
  }

  // save to session for later actions
  ;(ctx.session as any).debtors = debtors

  const header = ctx.i18n.t("inform_about_debt.list_header")
  const lines = debtors.slice(0, 50).map(d => `L/S: ${d.account_number}${d.full_name ? ` — ${d.full_name}` : ""}${d.phone ? ` — ${d.phone}` : ""}`)
  await ctx.reply([header, "", ...lines].join("\n"))

  await ctx.reply(
    ctx.i18n.t("inform_about_debt.message"),
    Markup.keyboard([
      [ctx.i18n.t("inform_about_debt.all_at_once"), ctx.i18n.t("inform_about_debt.one_by_one")],
      [ctx.i18n.t("other.back")]
    ]).resize()
  )
})

informAboutDebtScene.hears(match("inform_about_debt.all_at_once"), async ctx => {
  const debtors: Debtor[] = ((ctx.session as any).debtors || []) as Debtor[]
  let sent = 0
  for (const d of debtors) {
    if (!d.phone) {
      continue
    }
    await sendThreeMessages(d.phone, ctx)
    sent += 1
  }

  await ctx.reply(ctx.i18n.t("inform_about_debt.success", {count: String(sent)}))
  return ctx.scene.enter("navigation-scene")
})

informAboutDebtScene.hears(match("inform_about_debt.one_by_one"), async ctx => {
  ;(ctx.session as any).debt_mode = "select"
  await ctx.reply(ctx.i18n.t("inform_about_debt.select_prompt"))
})

informAboutDebtScene.hears(match("other.back"), async ctx => {
  return ctx.scene.enter("navigation-scene")
})

informAboutDebtScene.on("text", async ctx => {
  const mode = (ctx.session as any).debt_mode
  if (mode !== "select") return

  const debtors: Debtor[] = ((ctx.session as any).debtors || []) as Debtor[]
  const text = (ctx.message as any).text || ""
  const lsList = text
    .split(/\D+/)
    .map(s => s.trim())
    .filter(Boolean)

  const byLs = new Map(debtors.map(d => [String(d.account_number), d]))
  const chosen: Debtor[] = []
  for (const ls of lsList) {
    const d = byLs.get(ls)
    if (d) chosen.push(d)
  }

  if (!chosen.length) {
    return ctx.reply(ctx.i18n.t("inform_about_debt.none_selected"))
  }

  let sent = 0
  for (const d of chosen) {
    if (!d.phone) continue
    await sendThreeMessages(d.phone, ctx)
    sent += 1
  }

  ;(ctx.session as any).debt_mode = undefined
  await ctx.reply(ctx.i18n.t("inform_about_debt.success", {count: String(sent)}))
  return ctx.scene.enter("navigation-scene")
})