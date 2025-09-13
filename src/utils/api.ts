import axios from "axios"

export const api = axios.create({
    baseURL: process.env.API_DOMAIN
})

export const defaultImage = "https://bellissimo.uz/_next/image?url=%2F_next%2Fstatic%2Fimages%2FdefaultPizza-52ae112899817790a8efb02737b29f81.png&w=750&q=75"
