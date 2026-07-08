import { axiosInstance } from "./axios"
import { getToken, getRefreshToken, setToken, setRefreshToken, removeAllTokens } from "./token"
import { API_ENDPOINTS } from "@/constants/api"

let isRefreshing = false
let failedQueue: Array<{
  resolve: (token: string) => void
  reject: (error: unknown) => void
}> = []

function processQueue(error: unknown, token: string | null = null): void {
  failedQueue.forEach((promise) => {
    if (error) {
      promise.reject(error)
    } else if (token) {
      promise.resolve(token)
    }
  })
  failedQueue = []
}

axiosInstance.interceptors.request.use(
  (config) => {
    const token = getToken()
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => Promise.reject(error),
)

axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config

    if (error.response?.status === 401) {
      const authEndpoints = [API_ENDPOINTS.AUTH.LOGIN, API_ENDPOINTS.AUTH.REGISTER, API_ENDPOINTS.AUTH.REFRESH]
      if (authEndpoints.some((ep) => error.response.config?.url?.includes(ep))) {
        return Promise.reject(error)
      }

      if (!isRefreshing) {
        isRefreshing = true

        try {
          const storedRefreshToken = getRefreshToken()

          if (storedRefreshToken) {
            const response = await axiosInstance.post(API_ENDPOINTS.AUTH.REFRESH, {
              refreshToken: storedRefreshToken,
            })

            const newAccessToken = response.data?.data?.accessToken
            const newRefreshToken = response.data?.data?.refreshToken

            if (newAccessToken) {
              setToken(newAccessToken)
              if (newRefreshToken) {
                setRefreshToken(newRefreshToken)
              }
              processQueue(null, newAccessToken)
              originalRequest.headers.Authorization = `Bearer ${newAccessToken}`
              return axiosInstance(originalRequest)
            }
          }

          processQueue(new Error("Sesión expirada"))
          removeAllTokens()
          window.location.href = "/login"
          return Promise.reject(error)
        } catch {
          processQueue(new Error("Sesión expirada"))
          removeAllTokens()
          window.location.href = "/login"
          return Promise.reject(error)
        } finally {
          isRefreshing = false
        }
      }

      return new Promise((resolve, reject) => {
        failedQueue.push({
          resolve: (token: string) => {
            originalRequest.headers.Authorization = `Bearer ${token}`
            resolve(axiosInstance(originalRequest))
          },
          reject: (err: unknown) => reject(err),
        })
      })
    }

    return Promise.reject(error)
  },
)
