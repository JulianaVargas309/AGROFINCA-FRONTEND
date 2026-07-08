import { axiosInstance } from "./axios"
import type { AxiosRequestConfig } from "axios"

export async function apiGet<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
  const { data } = await axiosInstance.get<T>(url, config)
  return data
}

export async function apiPost<T, B = unknown>(url: string, body?: B, config?: AxiosRequestConfig): Promise<T> {
  const { data } = await axiosInstance.post<T>(url, body, config)
  return data
}

export async function apiPut<T, B = unknown>(url: string, body?: B, config?: AxiosRequestConfig): Promise<T> {
  const { data } = await axiosInstance.put<T>(url, body, config)
  return data
}

export async function apiPatch<T, B = unknown>(url: string, body?: B, config?: AxiosRequestConfig): Promise<T> {
  const { data } = await axiosInstance.patch<T>(url, body, config)
  return data
}

export async function apiDelete<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
  const { data } = await axiosInstance.delete<T>(url, config)
  return data
}
