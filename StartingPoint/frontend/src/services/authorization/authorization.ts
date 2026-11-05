import environment from "../../config/environment"
import { generatePkcePair } from "./pkce"

const STATE_KEY = "oauth_state"
const CODE_VERIFIER_KEY = "oauth_code_verifier"

function generateState(): string {
    const randomValues = crypto.getRandomValues(new Uint8Array(32))

    return Array.from(randomValues)
        .map(value => value.toString(16).padStart(2, "0"))
        .join("")
}

export async function startAuthorization(): Promise<void> {
    const { codeVerifier, codeChallenge } = await generatePkcePair()

    const state = generateState()

    // Store temporary OAuth values for the callback.
    sessionStorage.setItem(STATE_KEY, state)
    sessionStorage.setItem(CODE_VERIFIER_KEY, codeVerifier)

    const authorizationUrl = new URL(
        environment.oauth.authorizationEndpoint,
        environment.apiBaseUrl
    )

    authorizationUrl.searchParams.set("client_id", environment.oauth.clientId)
    authorizationUrl.searchParams.set("redirect_uri", environment.oauth.redirectUri)
    authorizationUrl.searchParams.set("response_type", "code")
    authorizationUrl.searchParams.set("scope", environment.oauth.scope)
    authorizationUrl.searchParams.set("state", state)
    authorizationUrl.searchParams.set("code_challenge", codeChallenge)
    authorizationUrl.searchParams.set("code_challenge_method", "S256")

    window.location.assign(authorizationUrl.toString())
}