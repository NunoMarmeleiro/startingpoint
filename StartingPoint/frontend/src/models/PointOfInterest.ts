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
    | "Uncategorized"

export const poiCategoryMetadata: Record<
    POICategory,
    { label: string; color: string }
> = {
    Attraction: {
        label: "Attraction",
        color: "#E76F51",
    },
    Museum: {
        label: "Museum",
        color: "#6C63FF",
    },
    HistoricalSite: {
        label: "Historical Site",
        color: "#8D6E63",
    },
    Restaurant: {
        label: "Restaurant",
        color: "#E9A23B",
    },
    Cafe: {
        label: "Café",
        color: "#A67C52",
    },
    Bar: {
        label: "Bar",
        color: "#9B5DE5",
    },
    Park: {
        label: "Park",
        color: "#4CAF50",
    },
    Shopping: {
        label: "Shopping",
        color: "#F15BB5",
    },
    Accommodation: {
        label: "Accommodation",
        color: "#219EBC",
    },
    Other: {
        label: "Other",
        color: "#6B7280",
    },
    Uncategorized: {
        label: "Uncategorized",
        color: "#9CA3AF",
    },
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