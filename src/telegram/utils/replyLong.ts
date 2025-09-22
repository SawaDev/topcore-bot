import {AppContext} from "telegram/types/session/AppContext"

const TELEGRAM_TEXT_LIMIT = 4096

function splitTextByLimit(text: string, maxLen: number = TELEGRAM_TEXT_LIMIT): string[] {
  if (!text) return [""]
  if (text.length <= maxLen) return [text]

  const chunks: string[] = []
  let start = 0
  while (start < text.length) {
    let end = Math.min(start + maxLen, text.length)
    if (end < text.length) {
      const lastNewline = text.lastIndexOf("\n", end)
      const lastSpace = text.lastIndexOf(" ", end)
      const splitAt = Math.max(lastNewline, lastSpace)
      if (splitAt > start + 1000) {
        end = splitAt
      }
    }
    chunks.push(text.slice(start, end))
    start = end
  }
  return chunks
}

export async function replyLong(
  ctx: AppContext,
  text: string,
  extra?: Parameters<AppContext["reply"]>[1]
): Promise<void> {
  const parts = splitTextByLimit(text)
  for (const part of parts) {
    // eslint-disable-next-line no-await-in-loop
    await ctx.reply(part, extra)
  }
}

export default replyLong


