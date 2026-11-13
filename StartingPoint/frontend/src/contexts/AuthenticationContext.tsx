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
    getCurrentUser,
} from "../services/authentication/authenticationService"
import {
    clearTokens, getAccessToken, getIdToken,
    setAuthenticationFailureHandler
} from "../services/authentication/tokenManager.ts";
import { endAuthentication } from "../services/authorization/authorization.ts";

interface AuthenticationContextType {
    user: CurrentUserResponse | null
    isAuthenticated: boolean
    isLoading: boolean
    login: (request: LoginUserRequest) => Promise<void>
    logout: () => void
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
            clearTokens()
            setUser(null)
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