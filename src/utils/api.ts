import axios from "axios"

export const playMobileApi = axios.create({
  baseURL: process.env.PLAY_MOBILE_BASE_URL
})
