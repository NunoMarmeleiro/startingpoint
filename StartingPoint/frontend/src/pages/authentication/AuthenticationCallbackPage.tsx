import { useEffect, useState, useRef } from "react"
import { useNavigate } from "react-router-dom"
import { toast } from "sonner"
import { saveTokens } from "../../services/authentication/tokenManager"

import { exchangeAuthorizationCode } from "../../services/authentication/tokenService"
import { useAuthentication } from "../../contexts/AuthenticationContext"

const STATE_KEY = "oauth_state"
const CODE_VERIFIER_KEY = "oauth_code_verifier"

export default function AuthenticationCallbackPage() {
    const navigate = useNavigate()
    const hasProcessedCallback = useRef(false)
    const [error, setError] = useState<string | null>(null)
    const { refreshUser } = useAuthentication()
    
    useEffect(() => {
        if (hasProcessedCallback.current) {
            return
        }

        hasProcessedCallback.current = true
        const handleCallback = async () => {
            try {
                const parameters = new URLSearchParams(window.location.search)

                const code = parameters.get("code")
                const returnedState = parameters.get("state")
                const authorizationError = parameters.get("error")

                if (authorizationError) {
                    throw new Error(
                        parameters.get("error_description") ?? authorizationError
                    )
                }

                const expectedState = sessionStorage.getItem(STATE_KEY)
                const codeVerifier = sessionStorage.getItem(CODE_VERIFIER_KEY)
                
                if (!code || !returnedState || returnedState !== expectedState) {
                    throw new Error("Invalid OAuth callback state.")
                }

                if (!codeVerifier) {
                    throw new Error("PKCE code verifier is missing.")
                }

                const tokens = await exchangeAuthorizationCode({
                    code,
                    codeVerifier
                })

                sessionStorage.removeItem(STATE_KEY)
                sessionStorage.removeItem(CODE_VERIFIER_KEY)

                saveTokens(tokens)

                await refreshUser()
                navigate("/", { replace: true })
            } catch (error: unknown) {
                const message = error instanceof Error
                    ? error.message
                    : "Authentication failed."

                setError(message)
                toast.error(message)
            }
        }

        void handleCallback()
    }, [navigate])

    if (error) {
        return <p>Authentication failed: {error}</p>
    }

    return <p>Completing authentication...</p>
}