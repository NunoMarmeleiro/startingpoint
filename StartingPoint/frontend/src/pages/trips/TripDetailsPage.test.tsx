import {
    render,
    screen, waitFor,
} from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { MemoryRouter, Route, Routes } from "react-router-dom"
import { vi } from "vitest"
import TripDetailsPage from "./TripDetailsPage"
import {
    getTripById,
    deletePointOfInterest,
} from "../../services/tripService"
vi.mock("../../services/tripService", () => ({
    getTripById: vi.fn(),
    deletePointOfInterest: vi.fn(),
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

    it("deletes a point of interest after confirming", async () => {
        const user = userEvent.setup()

        vi.spyOn(window, "confirm").mockReturnValue(true)

        const trip = {
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
                    category: "Attraction" as const,
                    address: "Barcelona",
                    notes: "Visit in the morning",
                },
            ],
        }

        vi.mocked(getTripById)
            .mockResolvedValueOnce(trip)
            .mockResolvedValueOnce({
                ...trip,
                pointsOfInterest: [],
            })

        vi.mocked(deletePointOfInterest).mockResolvedValue()

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

        await screen.findByText("Sagrada Família")

        await user.click(
            screen.getByRole("button", { name: "Delete" })
        )

        await waitFor(() => {
            expect(deletePointOfInterest).toHaveBeenCalledWith(
                "trip-1",
                "poi-1"
            )
        })

        await waitFor(() => {
            expect(
                screen.queryByText("Sagrada Família")
            ).not.toBeInTheDocument()
        })
    })

    it("does not delete a point of interest when deletion is cancelled", async () => {
        const user = userEvent.setup()

        vi.spyOn(window, "confirm").mockReturnValue(false)

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

        await screen.findByText("Sagrada Família")

        await user.click(
            screen.getByRole("button", { name: "Delete" })
        )

        expect(deletePointOfInterest).not.toHaveBeenCalled()
        expect(
            screen.getByText("Sagrada Família")
        ).toBeInTheDocument()
    })
})

