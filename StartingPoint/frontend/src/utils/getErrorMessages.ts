import axios from "axios"

export function getErrorMessage(error: unknown): string {
    if (!axios.isAxiosError(error)) {
        return "Something went wrong. Please try again."
    }

    if (!error.response) {
        return "Unable to connect. Check your connection and try again."
    }

    const status = error.response.status
    const detail = error.response.data?.detail

    switch (status) {
        case 400:
        case 422:
            return detail ?? "Please check your input and try again."

        case 404:
            return "The requested resource could not be found."

        case 409:
            return detail ?? "This action conflicts with the current state."

        default:
            return "Something went wrong. Please try again."
    }
}