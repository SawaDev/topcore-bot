import axios from "axios"
import {playmobileLogger} from "telegram/config/logger.config"

export const playMobileApi = axios.create({
  baseURL: process.env.PLAY_MOBILE_BASE_URL
})

export const setBasicAuth = (username: string, password: string) => {
  playMobileApi.defaults.auth = {username, password}
}

export const clearAuth = () => {
  playMobileApi.defaults.auth = undefined
}

if (process.env.PLAY_MOBILE_USERNAME && process.env.PLAY_MOBILE_PASSWORD) {
  setBasicAuth(process.env.PLAY_MOBILE_USERNAME, process.env.PLAY_MOBILE_PASSWORD)
}

function sanitizeHeaders(headers: Record<string, any> | undefined) {
  if (!headers) return headers
  const clone = {...headers}
  if (clone.Authorization || clone.authorization) {
    const key = clone.Authorization ? "Authorization" : "authorization"
    clone[key] = "[REDACTED]"
  }
  return clone
}

playMobileApi.interceptors.request.use(config => {
  const method = (config.method || "GET").toUpperCase()
  const url = `${config.baseURL || ""}${config.url || ""}`
  const headers = sanitizeHeaders(config.headers as any)
  const authUser = (config as any).auth?.username
  // Never log password
  playmobileLogger.info({
    direction: "outbound",
    method,
    url,
    headers,
    authUser,
    data: config.data
  })
  return config
})

playMobileApi.interceptors.response.use(
  response => {
    playmobileLogger.info({
      direction: "inbound",
      status: response.status,
      url: response.config.url,
      data: response.data
    })
    return response
  },
  error => {
    const status = error?.response?.status
    const url = error?.config?.url
    playmobileLogger.error({
      direction: "error",
      status: status || "ERR",
      url: url || "",
      data: error?.response?.data,
      message: error?.message
    })
    return Promise.reject(error)
  }
)
