import {fireEvent, render, screen, waitFor} from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { describe, expect, it, vi } from "vitest"
import POIModal from "./POIModal"
import {updatePointOfInterest} from "../../services/tripService.ts";

vi.mock("../../services/tripService", () => ({
    addPointOfInterest: vi.fn(),
    updatePointOfInterest: vi.fn(),
}))

describe("AddPOIModal", () => {
    it("displays the POI form", () => {
        render(
            <POIModal
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

        const onSaved = vi.fn()
        const onClose = vi.fn()

        render(
            <POIModal
                tripId="trip-123"
                onSaved={onSaved}
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

        expect(onSaved).toHaveBeenCalled()
        const modal = screen.getByRole("heading", {
            name: "Add point of interest",
        }).closest("section")

        expect(modal).toBeInTheDocument()

        fireEvent.animationEnd(modal!)
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
            <POIModal
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
            <POIModal
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

    it("displays the existing POI information when editing", () => {
        const poi = {
            id: "poi-1",
            name: "Sagrada Família",
            description: "Famous basilica",
            category: "HistoricalSite" as const,
            address: "Barcelona",
            notes: "Book tickets in advance",
        }

        render(
            <POIModal
                tripId="trip-1"
                poiToEdit={poi}
                onClose={vi.fn()}
            />
        )

        expect(screen.getByDisplayValue("Sagrada Família")).toBeInTheDocument()
        expect(
            screen.getByDisplayValue("Famous basilica")
        ).toBeInTheDocument()
        expect(screen.getByDisplayValue("Barcelona")).toBeInTheDocument()
        expect(
            screen.getByDisplayValue("Book tickets in advance")
        ).toBeInTheDocument()

        expect(
            screen.getByRole("combobox")
        ).toHaveValue("HistoricalSite")
    })

    it("updates an existing POI", async () => {
        const user = userEvent.setup()

        const poi = {
            id: "poi-1",
            name: "Old Name",
            description: "Old description",
            category: "Attraction" as const,
            address: "Old address",
            notes: "Old notes",
        }

        render(
            <POIModal
                tripId="trip-1"
                poiToEdit={poi}
                onClose={vi.fn()}
            />
        )

        const nameInput = screen.getByDisplayValue("Old Name")

        await user.clear(nameInput)
        await user.type(nameInput, "Sagrada Família")

        await user.click(
            screen.getByRole("button", {
                name: /save/i,
            })
        )

        await waitFor(() => {
            expect(updatePointOfInterest).toHaveBeenCalledWith(
                "trip-1",
                "poi-1",
                {
                    name: "Sagrada Família",
                    category: "Attraction",
                    description: "Old description",
                    address: "Old address",
                    notes: "Old notes",
                }
            )
        })
    })
})