import apiClient from "./apiClient"
import type { Trip, CreateTripRequest } from "../models/Trip"

export async function getTrips(): Promise<Trip[]> {
    const response = await apiClient.get<Trip[]>("/api/trips")
    return response.data
}

export async function createTrip(
    request: CreateTripRequest
): Promise<Trip> {
    const response = await apiClient.post<Trip>(
        "/api/trips",
        request
    )

    return response.data
}