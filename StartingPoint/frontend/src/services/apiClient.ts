import axios, {type InternalAxiosRequestConfig} from "axios"
import environment from "../config/environment"
import {getValidAccessToken, refreshAccessToken} from "./authentication/tokenManager.ts";

interface RetryableRequestConfig extends InternalAxiosRequestConfig {
    _retry?: boolean
}

const apiClient = axios.create({
    baseURL: environment.apiBaseUrl,
    withCredentials: true,
    headers: {
        "Content-Type": "application/json"
    }
})

apiClient.interceptors.request.use(async config => {
    const accessToken = await getValidAccessToken()
    if (accessToken) {
        config.headers.Authorization = `Bearer ${accessToken}`
    }
    return config
})

apiClient.interceptors.response.use(
    response => response,
    async error => {
        const originalRequest =
            error.config as RetryableRequestConfig | undefined

        if (
            error.response?.status !== 401 ||
            !originalRequest ||
            originalRequest._retry
        ) {
            return Promise.reject(error)
        }

        originalRequest._retry = true

        const accessToken = await refreshAccessToken()

        if (!accessToken) {
            return Promise.reject(error)
        }

        originalRequest.headers.Authorization = `Bearer ${accessToken}`

        return apiClient(originalRequest)
    }
)

export default apiClient