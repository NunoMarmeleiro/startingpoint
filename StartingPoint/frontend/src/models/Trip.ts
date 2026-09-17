export type Trip = {
    id: string
    name: string
    destination: string
    startDate: string
    endDate: string
}

export type CreateTripRequest = {
    name: string
    destination: string
    startDate: string
    endDate: string
}