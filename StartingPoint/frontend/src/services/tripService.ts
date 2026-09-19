import apiClient from "./apiClient"
import type { Trip,
    CreateTripRequest, 
    UpdateTripRequest,
} from "../models/Trip"
import type {
    AddPointOfInterestRequest,
} from "../models/PointOfInterest"

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

export async function getTripById(
    id: string
): Promise<Trip> {
    const response = await apiClient.get<Trip>(
        `/api/trips/${id}`
    )

    return response.data
}

export async function updateTrip(
    id: string,
    request: UpdateTripRequest
): Promise<Trip> {
    const response = await apiClient.put<Trip>(
        `/api/trips/${id}`,
        request
    )

    return response.data
}

export async function addPointOfInterest(
    tripId: string,
    request: AddPointOfInterestRequest
): Promise<void> {
    await apiClient.post(
        `/api/trips/${tripId}/points-of-interest`,
        request
    )
}
