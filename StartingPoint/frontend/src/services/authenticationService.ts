import apiClient from "./apiClient"
import type { LoginUserRequest } from "../models/authentication/LoginRequest"
import type {CurrentUserResponse} from "../models/authentication/CurrentUserResponse.ts";

export async function login(
    request: LoginUserRequest
): Promise<void> {
    await apiClient.post("/api/auth/login", request)
}

export async function logout(): Promise<void> {
    await apiClient.post("/api/auth/logout")
}
export async function getCurrentUser(): Promise<CurrentUserResponse> {
    const response = await apiClient.get<CurrentUserResponse>(
        "/api/auth/me"
    )

    return response.data
}