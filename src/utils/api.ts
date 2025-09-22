import axios from "axios"

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
