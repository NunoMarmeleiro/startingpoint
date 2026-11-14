import apiClient from "../apiClient"
import type { 
    LoginUserRequest, 
    CurrentUserResponse,
    RegisterUserRequest
} from "../../models/authentication/ApplicationUser"

export async function login(
    request: LoginUserRequest
): Promise<void> {
    await apiClient.post("/api/auth/login", request)
}
export async function getCurrentUser(): Promise<CurrentUserResponse> {
    const response = await apiClient.get<CurrentUserResponse>(
        "/api/auth/me"
    )
    return response.data
}

export async function register(
    request: RegisterUserRequest
): Promise<void> {
    await apiClient.post("/api/auth/register", request)
}