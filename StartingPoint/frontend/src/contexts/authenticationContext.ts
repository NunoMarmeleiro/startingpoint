import { createContext } from "react"
import type { CurrentUserResponse, LoginUserRequest } from "../models/authentication/ApplicationUser"

export interface AuthenticationContextType {
    user: CurrentUserResponse | null
    isAuthenticated: boolean
    isLoading: boolean
    login: (request: LoginUserRequest) => Promise<void>
    logout: () => void
    refreshUser: () => Promise<void>
}

export const AuthenticationContext = createContext<AuthenticationContextType | undefined>(undefined)