import axios from "axios"
import environment from "../config/environment"

const oauthClient = axios.create({
    baseURL: environment.apiBaseUrl,
    withCredentials: true,
    headers: {
        "Content-Type": "application/x-www-form-urlencoded"
    }
})

export default oauthClient