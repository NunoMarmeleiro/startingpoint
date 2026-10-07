import { render, screen } from "@testing-library/react"
import {MemoryRouter, useLocation} from "react-router-dom"
import { describe, expect, it } from "vitest"
import TripCard from "./TripCard"
import type { Trip } from "../../models/Trip"
import userEvent from "@testing-library/user-event";

describe("TripCard", () => {
    it("displays the trip information", () => {
        const trip: Trip = {
            id: "123",
            name: "Barcelona Trip",
            destination: "Barcelona",
            startDate: "2026-10-01",
            endDate: "2026-10-05",
            pointsOfInterest: [],
        }
        const onDelete = vi.fn()
        render(
            <MemoryRouter>
                <TripCard trip={trip} onDelete={onDelete} />
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
    
    it("links to the trip details page", async () => {
        const user = userEvent.setup()
        
        const trip: Trip = {
            id: "123",
            name: "Barcelona Trip",
            destination: "Barcelona",
            startDate: "2026-10-01",
            endDate: "2026-10-05",
            pointsOfInterest: [],
        }

        const onDelete = vi.fn()
        render(
            <MemoryRouter>
                <TripCard trip={trip} onDelete={onDelete} />
                <LocationDisplay />
            </MemoryRouter>
        )

        await user.click(
            screen.getByRole("button", { name: "Edit" })
        )

        expect(
            screen.getByTestId("location")
        ).toHaveTextContent("/trips/123")
    })
})

function LocationDisplay() {
    const location = useLocation()
    return <div data-testid="location">{location.pathname}</div>
}