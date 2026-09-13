export type Trip = {
    id: string
    name: string
    destination: string
}

export type CreateTripRequest = {
    name: string
    destination: string
}