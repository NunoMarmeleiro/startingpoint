import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { describe, expect, it, vi } from "vitest"
import AddPOIModal from "./AddPOIModal"

vi.mock("../../services/tripService", () => ({
    addPointOfInterest: vi.fn(),
}))

describe("AddPOIModal", () => {
    it("displays the POI form", () => {
        render(
            <AddPOIModal
                tripId="trip-123"
                onClose={vi.fn()}
            />
        )

        expect(
            screen.getByRole("heading", {
                name: "Add point of interest",
            })
        ).toBeInTheDocument()

        expect(screen.getByLabelText("Name")).toBeInTheDocument()
        expect(
            screen.getByLabelText("Category")
        ).toBeInTheDocument()
        expect(
            screen.getByLabelText("Description")
        ).toBeInTheDocument()
        expect(
            screen.getByLabelText("Address")
        ).toBeInTheDocument()
        expect(
            screen.getByLabelText("Notes")
        ).toBeInTheDocument()
    })

    it("adds a point of interest", async () => {
        const user = userEvent.setup()

        const {
            addPointOfInterest,
        } = await import("../../services/tripService")

        const addPointOfInterestMock = vi.mocked(
            addPointOfInterest
        )

        addPointOfInterestMock.mockResolvedValue()

        const onAdded = vi.fn()
        const onClose = vi.fn()

        render(
            <AddPOIModal
                tripId="trip-123"
                onAdded={onAdded}
                onClose={onClose}
            />
        )

        await user.type(
            screen.getByLabelText("Name"),
            "Sagrada Família"
        )

        await user.selectOptions(
            screen.getByLabelText("Category"),
            "HistoricalSite"
        )

        await user.type(
            screen.getByLabelText("Description"),
            "Famous basilica"
        )

        await user.type(
            screen.getByLabelText("Address"),
            "Barcelona"
        )

        await user.type(
            screen.getByLabelText("Notes"),
            "Book tickets in advance"
        )

        await user.click(
            screen.getByRole("button", {
                name: "Add POI",
            })
        )

        expect(addPointOfInterestMock).toHaveBeenCalledWith(
            "trip-123",
            {
                name: "Sagrada Família",
                category: "HistoricalSite",
                description: "Famous basilica",
                address: "Barcelona",
                notes: "Book tickets in advance",
            }
        )

        expect(onAdded).toHaveBeenCalled()
        expect(onClose).toHaveBeenCalled()
    })

    it("does not add a POI when the name is empty", async () => {
        const user = userEvent.setup()

        const {
            addPointOfInterest,
        } = await import("../../services/tripService")

        const addPointOfInterestMock = vi.mocked(
            addPointOfInterest
        )

        addPointOfInterestMock.mockClear()

        render(
            <AddPOIModal
                tripId="trip-123"
                onClose={vi.fn()}
            />
        )

        const nameInput = screen.getByLabelText("Name")

        nameInput.removeAttribute("required")

        await user.click(
            screen.getByRole("button", {
                name: "Add POI",
            })
        )

        expect(
            screen.getByText("Name is required.")
        ).toBeInTheDocument()

        expect(addPointOfInterestMock).not.toHaveBeenCalled()
    })

    it("keeps the form open when adding the POI fails", async () => {
        const user = userEvent.setup()

        const {
            addPointOfInterest,
        } = await import("../../services/tripService")

        const addPointOfInterestMock = vi.mocked(
            addPointOfInterest
        )

        addPointOfInterestMock.mockRejectedValue(
            new Error("API error")
        )

        const onClose = vi.fn()

        render(
            <AddPOIModal
                tripId="trip-123"
                onClose={onClose}
            />
        )

        await user.type(
            screen.getByLabelText("Name"),
            "Sagrada Família"
        )

        await user.click(
            screen.getByRole("button", {
                name: "Add POI",
            })
        )

        expect(
            await screen.findByText(
                "Something went wrong while adding the point of interest. Please try again."
            )
        ).toBeInTheDocument()

        expect(
            screen.getByDisplayValue("Sagrada Família")
        ).toBeInTheDocument()

        expect(onClose).not.toHaveBeenCalled()
    })
})