import type { PointOfInterest } from "./PointOfInterest"

export type Trip = {
    id: string
    name: string
    destination: string
    startDate: string
    endDate: string,
    pointsOfInterest: PointOfInterest[]
}

export type CreateTripRequest = {
    name: string
    destination: string
    startDate: string
    endDate: string
}

export type UpdateTripRequest = {
    name: string
    destination: string
    startDate: string
    endDate: string
}