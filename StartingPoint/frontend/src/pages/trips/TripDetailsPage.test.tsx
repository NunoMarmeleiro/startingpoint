import { render, screen } from "@testing-library/react"
import { MemoryRouter, Route, Routes } from "react-router-dom"
import { vi } from "vitest"
import TripDetailsPage from "./TripDetailsPage"
import { getTripById } from "../../services/tripService"

vi.mock("../../services/tripService", () => ({
    getTripById: vi.fn(),
}))

describe("TripDetailsPage", () => {
    it("displays the trip's points of interest", async () => {
        vi.mocked(getTripById).mockResolvedValue({
            id: "trip-1",
            name: "Barcelona",
            destination: "Barcelona",
            startDate: "2026-09-20",
            endDate: "2026-09-25",
            pointsOfInterest: [
                {
                    id: "poi-1",
                    name: "Sagrada Família",
                    description: "A famous basilica",
                    category: "Attraction",
                    address: "Barcelona",
                    notes: "Visit in the morning",
                },
            ],
        })

        render(
            <MemoryRouter initialEntries={["/trips/trip-1"]}>
                <Routes>
                    <Route
                        path="/trips/:id"
                        element={<TripDetailsPage />}
                    />
                </Routes>
            </MemoryRouter>
        )

        expect(
            await screen.findByText("Sagrada Família")
        ).toBeInTheDocument()
    })

    it("displays the empty state when the trip has no points of interest", async () => {
        vi.mocked(getTripById).mockResolvedValue({
            id: "trip-1",
            name: "Barcelona",
            destination: "Barcelona",
            startDate: "2026-09-20",
            endDate: "2026-09-25",
            pointsOfInterest: [],
        })

        render(
            <MemoryRouter initialEntries={["/trips/trip-1"]}>
                <Routes>
                    <Route
                        path="/trips/:id"
                        element={<TripDetailsPage />}
                    />
                </Routes>
            </MemoryRouter>
        )

        expect(
            await screen.findByText(
                "You don't have any place yet. Add your first point of interest to start building your trip."
            )
        ).toBeInTheDocument()
    })
})