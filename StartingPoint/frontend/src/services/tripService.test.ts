import { describe, expect, it, vi } from "vitest"
import apiClient from "./apiClient"
import { addPointOfInterest } from "./tripService"

vi.mock("./apiClient", () => ({
    default: {
        post: vi.fn(),
    },
}))

describe("addPointOfInterest", () => {
    it("sends a POST request with the correct trip and POI data", async () => {
        const request = {
            name: "Sagrada Família",
            category: "HistoricalSite" as const,
            description: "Famous basilica",
            address: "Barcelona",
            notes: "Book tickets in advance",
        }

        await addPointOfInterest("trip-123", request)

        expect(apiClient.post).toHaveBeenCalledWith(
            "/api/trips/trip-123/points-of-interest",
            request
        )
    })
})