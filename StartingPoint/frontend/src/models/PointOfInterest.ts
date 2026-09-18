export type POICategory =
    | "Attraction"
    | "Museum"
    | "HistoricalSite"
    | "Restaurant"
    | "Cafe"
    | "Bar"
    | "Park"
    | "Shopping"
    | "Accommodation"
    | "Other"

export type PointOfInterest = {
    id: string
    name: string
    description?: string
    category: POICategory
    address?: string
    notes?: string
}

export type AddPointOfInterestRequest = {
    name: string
    category: POICategory
    description?: string
    address?: string
    notes?: string
}