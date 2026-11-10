import {
    createContext,
    useContext,
    useEffect,
    useState,
    type ReactNode,
} from "react"

import type { 
    LoginUserRequest, 
    CurrentUserResponse 
} from "../models/authentication/ApplicationUser"

import {
    login as loginRequest,
    logout as logoutRequest,
    getCurrentUser,
} from "../services/authentication/authenticationService"
import {
    clearTokens,
    setAuthenticationFailureHandler
} from "../services/authentication/tokenManager.ts";

interface AuthenticationContextType {
    user: CurrentUserResponse | null
    isAuthenticated: boolean
    isLoading: boolean
    login: (request: LoginUserRequest) => Promise<void>
    logout: () => Promise<void>
    refreshUser: () => Promise<void>
}

const AuthenticationContext = createContext<
    AuthenticationContextType | undefined
>(undefined)

interface AuthenticationProviderProps {
    children: ReactNode
}

export function AuthenticationProvider({
                                           children,
                                       }: AuthenticationProviderProps) {
    const [user, setUser] = useState<CurrentUserResponse | null>(null)
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        setAuthenticationFailureHandler(() => {
            console.error("[Authentication] Refresh failure triggered logout")
            void logout()
        })

        return () => {
            setAuthenticationFailureHandler(() => {})
        }
    }, [])
    
    async function refreshUser() {
        const currentUser = await getCurrentUser()
        setUser(currentUser)
    }

    async function login(request: LoginUserRequest) {
        await loginRequest(request)
    }

    async function logout() {
        clearTokens()

        try {
            await logoutRequest()
        } finally {
            setUser(null)
        }
    }
    
    useEffect(() => {
        async function loadUser() {
            try {
                await refreshUser()
            } catch {
                setUser(null)
            } finally {
                setIsLoading(false)
            }
        }

        loadUser()
    }, [])

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

export function useAuthentication() {
    const context = useContext(AuthenticationContext)

    if (!context) {
        throw new Error(
            "useAuthentication must be used within AuthenticationProvider"
        )
    }

    return context
}