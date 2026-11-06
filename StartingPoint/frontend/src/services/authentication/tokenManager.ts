import type { TokenResponse } from "../../models/authentication/TokenResponse"
import { refreshAccessToken as requestRefresh } from "./tokenService"

const ACCESS_TOKEN_KEY = "access_token"
const REFRESH_TOKEN_KEY = "refresh_token"
const EXPIRES_AT_KEY = "access_token_expires_at"

const REFRESH_THRESHOLD_MS = 60_000
let refreshPromise: Promise<string | null> | null = null
let onAuthenticationFailure: (() => void) | null = null

export function setAuthenticationFailureHandler(
    handler: () => void
): void {
    onAuthenticationFailure = handler
}
export function saveTokens(tokens: TokenResponse): void {
    sessionStorage.setItem(ACCESS_TOKEN_KEY, tokens.access_token)

    if (tokens.refresh_token) {
        sessionStorage.setItem(REFRESH_TOKEN_KEY, tokens.refresh_token)
    }

    const expiresAt = Date.now() + tokens.expires_in * 1000

    sessionStorage.setItem(EXPIRES_AT_KEY, expiresAt.toString())
}

export function getAccessToken(): string | null {
    return sessionStorage.getItem(ACCESS_TOKEN_KEY)
}

export function clearTokens(): void {
    sessionStorage.removeItem(ACCESS_TOKEN_KEY)
    sessionStorage.removeItem(REFRESH_TOKEN_KEY)
    sessionStorage.removeItem(EXPIRES_AT_KEY)
}

export async function refreshAccessToken(): Promise<string | null> {
    if (refreshPromise) {
        return refreshPromise
    }

    const refreshToken = sessionStorage.getItem(REFRESH_TOKEN_KEY)

    if (!refreshToken) {
        onAuthenticationFailure?.()
        clearTokens()
        return null
    }

    refreshPromise = (async () => {
        try {
            const tokens = await requestRefresh({ refreshToken })

            saveTokens({
                ...tokens,
                refresh_token: tokens.refresh_token ?? refreshToken
            })

            return tokens.access_token
        } catch {
            clearTokens()
            return null
        } finally {
            refreshPromise = null
        }
    })()

    return refreshPromise
}

export async function getValidAccessToken(): Promise<string | null> {
    const accessToken = getAccessToken()
    const expiresAt = Number(sessionStorage.getItem(EXPIRES_AT_KEY))

    if (!accessToken) {
        return null
    }

    if (expiresAt && Date.now() < expiresAt - REFRESH_THRESHOLD_MS) {
        return accessToken
    }

    return refreshAccessToken()
}

