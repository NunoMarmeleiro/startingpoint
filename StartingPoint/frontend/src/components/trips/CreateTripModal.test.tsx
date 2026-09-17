import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { describe, expect, it, vi } from "vitest"
import CreateTripModal from "./CreateTripModal"
import type { Trip } from "../../models/Trip"

vi.mock("../../services/tripService", () => ({
    createTrip: vi.fn(),
    updateTrip: vi.fn(),
}))

describe("CreateTripModal", () => {
    it("pre-fills the form when editing a trip", () => {
        const trip: Trip = {
            id: "123",
            name: "Barcelona Trip",
            destination: "Barcelona",
            startDate: "2026-10-01",
            endDate: "2026-10-05",
        }

        render(
            <CreateTripModal
                tripToEdit={trip}
                onClose={vi.fn()}
            />
        )

        expect(
            screen.getByDisplayValue("Barcelona Trip")
        ).toBeInTheDocument()

        expect(
            screen.getByDisplayValue("Barcelona")
        ).toBeInTheDocument()

        expect(
            screen.getByDisplayValue("2026-10-01")
        ).toBeInTheDocument()

        expect(
            screen.getByDisplayValue("2026-10-05")
        ).toBeInTheDocument()
    })

    it("updates the trip when saving changes", async () => {
        const user = userEvent.setup()

        const trip: Trip = {
            id: "123",
            name: "Barcelona Trip",
            destination: "Barcelona",
            startDate: "2026-10-01",
            endDate: "2026-10-05",
        }

        const updatedTrip: Trip = {
            ...trip,
            name: "Madrid Trip",
            destination: "Madrid",
            startDate: "2026-11-01",
            endDate: "2026-11-07",
        }

        const updateTripMock = vi.mocked(
            (await import("../../services/tripService")).updateTrip
        )

        updateTripMock.mockResolvedValue(updatedTrip)

        const onUpdated = vi.fn()
        const onClose = vi.fn()

        render(
            <CreateTripModal
                tripToEdit={trip}
                onClose={onClose}
                onUpdated={onUpdated}
            />
        )

        const nameInput = screen.getByDisplayValue("Barcelona Trip")
        const destinationInput = screen.getByDisplayValue("Barcelona")
        const startDateInput = screen.getByDisplayValue("2026-10-01")
        const endDateInput = screen.getByDisplayValue("2026-10-05")

        await user.clear(nameInput)
        await user.type(nameInput, "Madrid Trip")

        await user.clear(destinationInput)
        await user.type(destinationInput, "Madrid")

        await user.clear(startDateInput)
        await user.type(startDateInput, "2026-11-01")

        await user.clear(endDateInput)
        await user.type(endDateInput, "2026-11-07")

        await user.click(
            screen.getByRole("button", { name: "Save changes" })
        )

        expect(updateTripMock).toHaveBeenCalledWith(
            "123",
            {
                name: "Madrid Trip",
                destination: "Madrid",
                startDate: "2026-11-01",
                endDate: "2026-11-07",
            }
        )

        expect(onUpdated).toHaveBeenCalledWith(updatedTrip)
    })

    it("does not update the trip when the end date is before the start date", async () => {
        const user = userEvent.setup()

        const trip: Trip = {
            id: "123",
            name: "Barcelona Trip",
            destination: "Barcelona",
            startDate: "2026-10-01",
            endDate: "2026-10-05",
        }

        const updateTripMock = vi.mocked(
            (await import("../../services/tripService")).updateTrip
        )

        const onUpdated = vi.fn()

        render(
            <CreateTripModal
                tripToEdit={trip}
                onClose={vi.fn()}
                onUpdated={onUpdated}
            />
        )

        const startDateInput = screen.getByDisplayValue("2026-10-01")
        const endDateInput = screen.getByDisplayValue("2026-10-05")

        await user.clear(startDateInput)
        await user.type(startDateInput, "2026-11-10")

        await user.clear(endDateInput)
        await user.type(endDateInput, "2026-11-05")

        endDateInput.removeAttribute("min")

        await user.click(
            screen.getByRole("button", { name: "Save changes" })
        )

        expect(
            screen.getByText("End date cannot be before start date.")
        ).toBeInTheDocument()

        expect(updateTripMock).not.toHaveBeenCalled()
        expect(onUpdated).not.toHaveBeenCalled()
    })

    it("keeps the form open and preserves the entered values when updating fails", async () => {
        const user = userEvent.setup()

        const trip: Trip = {
            id: "123",
            name: "Barcelona Trip",
            destination: "Barcelona",
            startDate: "2026-10-01",
            endDate: "2026-10-05",
        }

        const updateTripMock = vi.mocked(
            (await import("../../services/tripService")).updateTrip
        )

        updateTripMock.mockRejectedValue(new Error("API error"))

        render(
            <CreateTripModal
                tripToEdit={trip}
                onClose={vi.fn()}
            />
        )

        const nameInput = screen.getByDisplayValue("Barcelona Trip")

        await user.clear(nameInput)
        await user.type(nameInput, "My New Barcelona Trip")

        await user.click(
            screen.getByRole("button", { name: "Save changes" })
        )

        expect(
            await screen.findByText(
                "Something went wrong while updating the trip. Please try again."
            )
        ).toBeInTheDocument()

        expect(
            screen.getByDisplayValue("My New Barcelona Trip")
        ).toBeInTheDocument()
    })
    
})