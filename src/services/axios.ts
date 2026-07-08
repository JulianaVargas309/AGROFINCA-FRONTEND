import axios from "axios"
import { API_TIMEOUT } from "@/constants/api"
import "./interceptors"

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  timeout: API_TIMEOUT,
  headers: {
    "Content-Type": "application/json",
  },
})

export { axiosInstance }
