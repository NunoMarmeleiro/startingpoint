import { render, screen, waitFor } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { vi, describe, it, expect, beforeEach } from "vitest"
import TripList from "./TripList"
import { getTrips, deleteTrip } from "../../services/tripService"
import type { Trip } from "../../models/Trip"
import { MemoryRouter } from "react-router-dom"

vi.mock("../../services/tripService", () => ({
    getTrips: vi.fn(),
    deleteTrip: vi.fn(),
}))

const trips: Trip[] = [
    {
        id: "trip-1",
        name: "Barcelona",
        destination: "Barcelona, Spain",
        startDate: "2026-10-10",
        endDate: "2026-10-15",
        pointsOfInterest: [],
    },
    {
        id: "trip-2",
        name: "Berlin",
        destination: "Berlin, Germany",
        startDate: "2026-11-01",
        endDate: "2026-11-05",
        pointsOfInterest: [],
    },
]

describe("TripList", () => {
    beforeEach(() => {
        vi.clearAllMocks()

        vi.mocked(getTrips).mockResolvedValue(trips)
        vi.mocked(deleteTrip).mockResolvedValue()
    })

    it("deletes a trip after confirming", async () => {
        const user = userEvent.setup()

        vi.spyOn(window, "confirm").mockReturnValue(true)

        render(
            <MemoryRouter>
                <TripList />
            </MemoryRouter>
        )

        await screen.findByText("Barcelona")

        const deleteButtons = screen.getAllByRole("button", {
            name: "Delete",
        })

        await user.click(deleteButtons[0])

        await waitFor(() => {
            expect(deleteTrip).toHaveBeenCalledWith("trip-1")
        })

        expect(
            screen.queryByText("Barcelona")
        ).not.toBeInTheDocument()

        expect(screen.getByText("Berlin")).toBeInTheDocument()
    })

    it("does not delete a trip when deletion is cancelled", async () => {
        const user = userEvent.setup()

        vi.spyOn(window, "confirm").mockReturnValue(false)

        render(
            <MemoryRouter>
                <TripList />
            </MemoryRouter>
        )

        await screen.findByText("Barcelona")

        const deleteButtons = screen.getAllByRole("button", {
            name: "Delete",
        })

        await user.click(deleteButtons[0])

        expect(deleteTrip).not.toHaveBeenCalled()

        expect(screen.getByText("Barcelona")).toBeInTheDocument()
        expect(screen.getByText("Berlin")).toBeInTheDocument()
    })
})