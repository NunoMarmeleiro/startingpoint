import { describe, expect, it } from "vitest"
import type { AxiosError } from "axios"
import {getErrorMessage} from "./getErrorMessages.ts";

function createAxiosError(
    status?: number,
    data?: unknown
): AxiosError {
    return {
        isAxiosError: true,
        response:
            status === undefined
                ? undefined
                : {
                      status,
                      data,
                  },
    } as unknown as AxiosError
}

describe("getErrorMessage", () => {
    it("returns a network error message when there is no response", () => {
        const error = createAxiosError()

        expect(getErrorMessage(error)).toBe(
            "Unable to connect. Check your connection and try again."
        )
    })

    it("returns a validation message for a 400 response", () => {
        const error = createAxiosError(400, {
            detail: "Please check your input.",
        })

        expect(getErrorMessage(error)).toBe(
            "Please check your input."
        )
    })

    it("returns a default validation message when a 400 response has no detail", () => {
        const error = createAxiosError(400, {})

        expect(getErrorMessage(error)).toBe(
            "Please check your input and try again."
        )
    })

    it("returns a validation message for a 422 response", () => {
        const error = createAxiosError(422, {
            detail: "The end date must be after the start date.",
        })

        expect(getErrorMessage(error)).toBe(
            "The end date must be after the start date."
        )
    })

    it("returns a not-found message for a 404 response", () => {
        const error = createAxiosError(404, {
            detail: "Internal database details",
        })

        expect(getErrorMessage(error)).toBe(
            "The requested resource could not be found."
        )
    })

    it("returns a conflict message for a 409 response", () => {
        const error = createAxiosError(409, {
            detail: "This trip already exists.",
        })

        expect(getErrorMessage(error)).toBe(
            "This trip already exists."
        )
    })

    it("returns a default conflict message when a 409 response has no detail", () => {
        const error = createAxiosError(409, {})

        expect(getErrorMessage(error)).toBe(
            "This action conflicts with the current state."
        )
    })

    it("does not expose server details for an unexpected error", () => {
        const error = createAxiosError(500, {
            detail: "Internal database details and stack trace",
        })

        expect(getErrorMessage(error)).toBe(
            "Something went wrong. Please try again."
        )
    })

    it("returns a generic message for a non-Axios error", () => {
        const error = new Error("Internal implementation details")

        expect(getErrorMessage(error)).toBe(
            "Something went wrong. Please try again."
        )
    })
})