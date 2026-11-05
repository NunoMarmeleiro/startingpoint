import axios from "axios"
import environment from "../config/environment"

const apiClient = axios.create({
    baseURL: environment.apiBaseUrl,
    withCredentials: true,
    headers: {
        "Content-Type": "application/json"
    }
})

apiClient.interceptors.request.use(config => {
    const accessToken = sessionStorage.getItem("access_token")
    if (accessToken) {
        config.headers.Authorization = `Bearer ${accessToken}`
    }
    return config
})

export default apiClient