import oauthClient from "../oauthClient"
import environment from "../../config/environment"
import type { TokenResponse } from "../../models/authentication/TokenResponse"

interface ExchangeAuthorizationCodeRequest {
    code: string
    codeVerifier: string
}

export async function exchangeAuthorizationCode({
                                                    code,
                                                    codeVerifier
                                                }: ExchangeAuthorizationCodeRequest): Promise<TokenResponse> {
    const body = new URLSearchParams({
        grant_type: "authorization_code",
        client_id: environment.oauth.clientId,
        redirect_uri: environment.oauth.redirectUri,
        code,
        code_verifier: codeVerifier
    })

    const response = await oauthClient.post<TokenResponse>(
        environment.oauth.tokenEndpoint,
        body
    )

    return response.data
}

interface RefreshAccessTokenRequest {
    refreshToken: string
}

export async function refreshAccessToken({
                                             refreshToken
                                         }: RefreshAccessTokenRequest): Promise<TokenResponse> {
    const body = new URLSearchParams({
        grant_type: "refresh_token",
        client_id: environment.oauth.clientId,
        refresh_token: refreshToken
    })

    const response = await oauthClient.post<TokenResponse>(
        environment.oauth.tokenEndpoint,
        body
    )

    return response.data
}