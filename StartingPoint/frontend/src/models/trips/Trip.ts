import type { PointOfInterest } from "../pois/PointOfInterest"

export interface Trip {
    id: string
    name: string
    destination: string
    startDate: string
    endDate: string,
    pointsOfInterest: PointOfInterest[]
}

export interface CreateTripRequest {
    name: string
    destination: string
    startDate: string
    endDate: string
}

export interface UpdateTripRequest {
    name: string
    destination: string
    startDate: string
    endDate: string
}