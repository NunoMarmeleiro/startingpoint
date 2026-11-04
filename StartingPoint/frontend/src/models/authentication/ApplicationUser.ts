export type CurrentUserResponse = {
    id: string
    email: string
    username: string
}

export type LoginUserRequest = {
    email: string;
    password: string;
}

export type RegisterUserRequest = {
    email: string;
    password: string;
    username: string;
}