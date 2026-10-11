import axios from "axios"

type ValidationProblemDetails = {
    detail?: string
    errors?: Record<string, string[]>
}

export function getErrorMessage(error: unknown): string {
    if (!axios.isAxiosError<ValidationProblemDetails>(error)) {
        return "Something went wrong. Please try again."
    }

    if (!error.response) {
        return "Unable to connect. Check your connection and try again."
    }

    const { status, data } = error.response

    switch (status) {
        case 400:
        case 422: {
            if (typeof data?.detail === "string" && data.detail) {
                return data.detail
            }

            const validationErrors = Object.values(
                data?.errors ?? {}
            ).flat()

            const firstValidationError = validationErrors.find(
                (message): message is string =>
                    typeof message === "string" && message.length > 0
            )

            return firstValidationError ??
                "Please check your input and try again."
        }

        case 404:
            return "The requested resource could not be found."

        case 409:
            return data?.detail ??
                "This action conflicts with the current state."

        default:
            return "Something went wrong. Please try again."
    }
}