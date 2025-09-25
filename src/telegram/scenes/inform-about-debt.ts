import {Markup, Scenes} from "telegraf"
import {AppContext} from "telegram/types/session/AppContext"
import {db} from "db"
import {match} from "telegram/match/match"
import {chunk} from "utils/chunk"
import {replyLong} from "telegram/utils/replyLong"
import {playMobileApi} from "utils/api"
import moment from "moment"

export const informAboutDebtScene = new Scenes.BaseScene<AppContext>("inform-about-debt-scene")

type Debtor = {
  id: number
  account_number: number
  full_name: string | null
  phone: string | null
  area: number | null
  end_balance: string | number | null
  address: string | null
}

async function getDebtors(): Promise<Debtor[]> {
  const latest = db("abonent_balances")
    .select("abonent_id")
    .max({created_at: "created_at"})
    .groupBy("abonent_id")

  const rows: Debtor[] = await db
    .with("latest", latest)
    .select("a.id", "a.account_number", "a.full_name", "a.phone", "a.area", "lb.end_balance", "a.address")
    .from({a: "abonents"})
    .leftJoin({lt: "latest"}, "lt.abonent_id", "a.id")
    .leftJoin({lb: "abonent_balances"}, function () {
      this.on("lb.abonent_id", "=", "a.id").andOn("lb.created_at", "=", "lt.created_at")
    })
    .where("a.is_white_listed", false)
    .whereRaw("300000 <= COALESCE(lb.end_balance::numeric, 0)")
    .orderBy("a.account_number", "asc")

  return rows
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
  const lines = debtors.map(
    (d, index) =>
      `${index + 1}. ${d.full_name}\nL/S: ${d.account_number}${d.phone ? `\nT/N: ${d.phone}` : ""}${
        d.address ? `\nManzil: ${d.address}` : ""
      } ${d?.end_balance ? `\nAbonent qarzi: ${Number(d.end_balance)?.toLocaleString("fr-FR")}` : ""}`
  )
  await replyLong(ctx, [header, "", ...lines].join("\n"))

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
  let messages: any[] = []

  for (const d of debtors) {
    if (!d.phone) continue
    sent += 1
    messages.push({
      sms: {
        content: {
          text: ctx.i18n.t("inform_about_debt.sms1", {
            full_name: d.full_name || "",
            address: d.address || "",
            account_number: d.account_number.toString(),
            end_balance: Number(d.end_balance)?.toLocaleString("fr-FR")
          })
        },
        originator: "3700"
      },
      recipient: d.phone,
      "message-id": `${d.account_number}-${moment().format("YYYYMMDDHHmmss")}`
    })
  }

  if (messages.length) {
    const batches = chunk(messages, 30)
    for (const batch of batches) {
      try {
        await playMobileApi.post("/broker-api/send-sms", {messages: batch})
      } catch (error) {
        const anyErr: any = error
        const status = anyErr?.response?.status
        const data = anyErr?.response?.data
        console.error("SMS send error", {
          status,
          data,
          message: anyErr?.message,
          batch
        })
      }
    }
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
  let messages: any[] = []

  for (const d of chosen) {
    if (!d.phone) continue
    sent += 1
    messages.push({
      sms: {
        content: {
          text: ctx.i18n.t("inform_about_debt.sms1", {
            full_name: d.full_name || "",
            address: d.address || "",
            account_number: d.account_number.toString(),
            end_balance: Number(d.end_balance)?.toLocaleString("fr-FR")
          })
        },
        originator: "3700"
      },
      recipient: d.phone,
      "message-id": `${d.account_number}-${moment().format("YYYYMMDDHHmmss")}`
    })
  }

  if (messages.length) {
    const batches = chunk(messages, 30)
    for (const batch of batches) {
      try {
        await playMobileApi.post("/broker-api/send-sms", {messages: batch})
      } catch (error) {
        console.error("SMS send error", batch, error)
      }
    }
  }

  ;(ctx.session as any).debt_mode = undefined
  await ctx.reply(ctx.i18n.t("inform_about_debt.success", {count: String(sent)}))
  return ctx.scene.enter("navigation-scene")
})
