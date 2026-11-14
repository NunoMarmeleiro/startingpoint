export interface CurrentUserResponse {
    id: string
    email: string
    username: string
}

export interface LoginUserRequest {
    emailOrUsername: string;
    password: string;
}

export interface RegisterUserRequest {
    email: string;
    password: string;
    username: string;
}