import { render, screen } from "@testing-library/react"
import { MemoryRouter } from "react-router-dom"
import { describe, expect, it } from "vitest"
import TripCard from "./TripCard"
import type { Trip } from "../../models/Trip"

describe("TripCard", () => {
    it("displays the trip information", () => {
        const trip: Trip = {
            id: "123",
            name: "Barcelona Trip",
            destination: "Barcelona",
            startDate: "2026-10-01",
            endDate: "2026-10-05",
        }

        render(
            <MemoryRouter>
                <TripCard trip={trip} />
            </MemoryRouter>
        )

        expect(
            screen.getByText("Barcelona Trip")
        ).toBeInTheDocument()

        expect(
            screen.getByText("Barcelona")
        ).toBeInTheDocument()

        expect(
            screen.getByText("2026-10-01 → 2026-10-05")
        ).toBeInTheDocument()
    })
    
    it("links to the trip details page", () => {
        const trip: Trip = {
            id: "123",
            name: "Barcelona Trip",
            destination: "Barcelona",
            startDate: "2026-10-01",
            endDate: "2026-10-05",
        }

        render(
            <MemoryRouter>
                <TripCard trip={trip} />
            </MemoryRouter>
        )

        const link = screen.getByRole("link")

        expect(link).toHaveAttribute("href", "/trips/123")
    })
})