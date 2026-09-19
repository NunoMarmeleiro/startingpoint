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

export const poiCategoryLabels: Record<POICategory, string> = {
    Attraction: "Attraction",
    Museum: "Museum",
    HistoricalSite: "Historical Site",
    Restaurant: "Restaurant",
    Cafe: "Café",
    Bar: "Bar",
    Park: "Park",
    Shopping: "Shopping",
    Accommodation: "Accommodation",
    Other: "Other",
}

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