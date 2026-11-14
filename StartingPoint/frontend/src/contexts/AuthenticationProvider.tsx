import {
    useEffect,
    useState,
    type ReactNode, useCallback,
} from "react"

import type { 
    LoginUserRequest, 
    CurrentUserResponse 
} from "../models/authentication/ApplicationUser"

import {
    login as loginRequest,
    getCurrentUser,
} from "../services/authentication/authenticationService"
import {
    clearTokens, getAccessToken, getIdToken,
    setAuthenticationFailureHandler
} from "../services/authentication/tokenManager.ts";
import { endAuthentication } from "../services/authorization/authorization.ts";
import { AuthenticationContext } from "./authenticationContext.ts";


export function AuthenticationProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<CurrentUserResponse | null>(null)
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        setAuthenticationFailureHandler(() => {
            clearTokens()
            setUser(null)
        })

        return () => {
            setAuthenticationFailureHandler(() => {})
        }
    }, [])

    const refreshUser = useCallback(async () => {
        const currentUser = await getCurrentUser()
        setUser(currentUser)
    }, [])

    async function login(request: LoginUserRequest) {
        await loginRequest(request)
    }

    function logout() {
        setIsLoading(true);
        const idToken = getIdToken()
        clearTokens()
        endAuthentication(idToken);
        setIsLoading(false);
    }
    
    useEffect(() => {
        async function loadUser() {
            if (!getAccessToken()) {
                setIsLoading(false)
                return
            }
            
            try {
                await refreshUser()
            } catch {
                setUser(null)
            } finally {
                setIsLoading(false)
            }
        }

        void loadUser()
    }, [refreshUser])

    return (
        <AuthenticationContext.Provider
            value={{
                user,
                isAuthenticated: user !== null,
                isLoading,
                login,
                logout,
                refreshUser,
            }}
        >
            {children}
        </AuthenticationContext.Provider>
    )
}
