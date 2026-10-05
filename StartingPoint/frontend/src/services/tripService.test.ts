import { describe, expect, it, vi } from "vitest"
import apiClient from "./apiClient"
import { addPointOfInterest, deleteTrip, deletePointOfInterest } from "./tripService"

vi.mock("./apiClient", () => ({
    default: {
        post: vi.fn(),
        delete: vi.fn(),
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

describe("deleteTrip", () => {
    it("deletes a trip", async () => {
        const tripId = "trip-123"

        await deleteTrip(tripId)

        expect(apiClient.delete).toHaveBeenCalledWith(
            `/api/trips/${tripId}`
        )
    })
})

describe("deletePOI", () => {
    it("deletes a POI", async () => {
        const tripId = "trip-123";
        const poiId = "poi-123";

        await deletePointOfInterest(tripId,poiId)

        expect(apiClient.delete).toHaveBeenCalledWith(
            `/api/trips/${tripId}/points-of-interest/${poiId}`
        )
    })
})