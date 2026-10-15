import {
    render,
    screen, waitFor, within,
} from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { MemoryRouter, Route, Routes } from "react-router-dom"
import {beforeEach, expect, it, vi} from "vitest"
import { toast } from "sonner"
import TripDetailsPage from "./TripDetailsPage"
import {
    getTripById,
    deletePointOfInterest,
} from "../../services/tripService"
import {getErrorMessage} from "../../utils/getErrorMessages.ts";
vi.mock("../../services/tripService", () => ({
    getTripById: vi.fn(),
    deletePointOfInterest: vi.fn(),
}))

beforeEach(() => {
    vi.resetAllMocks()
})

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
                "You don't have any places yet. Add your first point of interest to start building your trip."
            )
        ).toBeInTheDocument()
    })

    it("deletes a point of interest after confirming", async () => {
        const user = userEvent.setup()
        
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

        const poiCard = await screen.findByRole("article", {
            name: "Sagrada Família",
        })
        
        await user.click(
            within(poiCard).getByRole("button", { name: "Delete" })
        )
        
        const dialog = await screen.findByRole("alertdialog")
        
        await user.click(
            within(dialog).getByRole("button", { name: "Delete POI" })
        )
        
        await waitFor(() => {
            expect(
                screen.queryByText("Sagrada Família")
            ).not.toBeInTheDocument()
        })

        expect(toast.success).toHaveBeenCalledWith(
            "Point of interest deleted successfully."
        )
    })

    it("does not delete a point of interest when deletion is cancelled", async () => {
        const user = userEvent.setup()
        
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
        await waitFor(() => {
            expect(getTripById).toHaveBeenCalledWith("trip-1")
        })

        const poiCard = screen.getByRole("article", {
            name: "Sagrada Família",
        })

        await user.click(
            within(poiCard).getByRole("button", { name: "Delete" })
        )
        

        const dialog = await screen.findByRole("alertdialog")

        // Cancel the deletion
        await user.click(
            within(dialog).getByRole("button", { name: "Cancel" })
        )

        expect(deletePointOfInterest).not.toHaveBeenCalled()
        expect(
            screen.getByText("Sagrada Família")
        ).toBeInTheDocument()
    })

    it("shows an error toast when deleting a point of interest fails", async () => {
        const user = userEvent.setup()
        
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

        vi.mocked(getTripById).mockResolvedValue(trip)
        vi.mocked(deletePointOfInterest).mockRejectedValue(new Error("API error"))

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

        const poiCard = await screen.findByRole("article", {
            name: "Sagrada Família",
        })

        await user.click(
            within(poiCard).getByRole("button", { name: "Delete" })
        )

        const dialog = await screen.findByRole("alertdialog")

        await user.click(
            within(dialog).getByRole("button", { name: "Delete POI" })
        )

        await waitFor(() => {
            expect(toast.error).toHaveBeenCalledWith("Something went wrong. Please try again.")
        })

        expect(
            screen.getByText("Sagrada Família")
        ).toBeInTheDocument()
    })

    it("shows an error toast when loading the trip fails", async () => {
        vi.mocked(getTripById).mockRejectedValue(new Error("API error"))

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

        await waitFor(() => {
            expect(toast.error).toHaveBeenCalledWith(
                getErrorMessage("API error")
            )
        })
    })
})

