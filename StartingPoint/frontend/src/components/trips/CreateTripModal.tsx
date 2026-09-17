import { useEffect, useState } from "react"
import { createTrip, updateTrip } from "../../services/tripService"
import "./CreateTripModal.css"
import type { Trip } from "../../models/Trip"
import * as React from "react";

type CreateTripModalProps = {
    onCreated?: (trip: Trip) => void,
    onUpdated?: (trip: Trip) => void,
    onClose: () => void,
    tripToEdit?: Trip | null
}

function CreateTripModal({
                             onClose,
                             onCreated,
                             onUpdated,
                             tripToEdit,
                         }: CreateTripModalProps) {
    const [isClosing, setIsClosing] = useState(false)

    const [name, setName] = useState("")
    const [destination, setDestination] = useState("")
    const [startDate, setStartDate] = useState("")
    const [endDate, setEndDate] = useState("")
    const [dateError, setDateError] = useState("")
    const [error, setError] = useState("")

    useEffect(() => {
        setDateError("")
        setError("")

        if (!tripToEdit) {
            setName("")
            setDestination("")
            setStartDate("")
            setEndDate("")
            return
        }

        setName(tripToEdit.name)
        setDestination(tripToEdit.destination)
        setStartDate(tripToEdit.startDate)
        setEndDate(tripToEdit.endDate)
    }, [tripToEdit])
    
    function handleClose() {
        setIsClosing(true)
    }

    function handleAnimationEnd() {
        if (isClosing) {
            onClose()
        }
    }

    async function handleSubmit(
        event: React.SyntheticEvent<HTMLFormElement>
    ) {
        event.preventDefault()

        if (endDate < startDate) {
            setDateError("End date cannot be before start date.")
            return
        }

        setDateError("")
        setError("")

        try {
            if (tripToEdit) {
                const updatedTrip = await updateTrip(tripToEdit.id, {
                    name,
                    destination,
                    startDate,
                    endDate,
                })

                onUpdated?.(updatedTrip)
            } else {
                const createdTrip = await createTrip({
                    name,
                    destination,
                    startDate,
                    endDate,
                })

                onCreated?.(createdTrip)
            }

            handleClose()
        } catch {
            setError(
                tripToEdit
                    ? "Something went wrong while updating the trip. Please try again."
                    : "Something went wrong while creating the trip. Please try again."
            )
        }
    }

    return (
        <div
            className={`modal-backdrop ${
                isClosing ? "modal-backdrop--closing" : ""
            }`}
        >
            <section
                className={`create-trip-modal ${
                    isClosing ? "create-trip-modal--closing" : ""
                }`}
                onAnimationEnd={handleAnimationEnd}
            >
                <header className="create-trip-modal__header">
                    <div>
                        <h2>{tripToEdit ? "Edit trip" : "Create trip"}</h2>
                        <p>Plan your next adventure.</p>
                    </div>

                    <button
                        type="button"
                        className="modal-close"
                        onClick={handleClose}
                    >
                        ×
                    </button>
                </header>

                {error && (
                    <p className="create-trip__error">
                        {error}
                    </p>
                )}

                <form
                    className="create-trip__form"
                    onSubmit={handleSubmit}
                >
                    <div className="form-field">
                        <label htmlFor="name">
                            Trip name <span className="required">*</span>
                        </label>

                        <input
                            id="name"
                            type="text"
                            value={name}
                            onChange={(event) => setName(event.target.value)}
                            placeholder="e.g. Japan Adventure"
                            required
                        />
                    </div>

                    <div className="form-field">
                        <label htmlFor="destination">
                            Destination <span className="required">*</span>
                        </label>

                        <input
                            id="destination"
                            type="text"
                            value={destination}
                            onChange={(event) =>
                                setDestination(event.target.value)
                            }
                            placeholder="e.g. Tokyo, Japan"
                            required
                        />
                    </div>
                    <div className="form-field">
                        <label htmlFor="startDate">
                            Start date <span className="required">*</span>
                        </label>

                        <input
                            id="startDate"
                            type="date"
                            value={startDate}
                            onChange={(event) => setStartDate(event.target.value)}
                            required
                        />
                    </div>

                    <div className="form-field">
                        <label htmlFor="endDate">
                            End date <span className="required">*</span>
                        </label>

                        <input
                            id="endDate"
                            type="date"
                            value={endDate}
                            min={startDate}
                            onChange={(event) => setEndDate(event.target.value)}
                            required
                        />
                    </div>
                    
                    {dateError && (
                        <p className="form-field__error">
                            {dateError}
                        </p>
                    )}

                    <div className="create-trip__actions">
                        <button
                            type="button"
                            className="button button--secondary"
                            onClick={handleClose}
                        >
                            Cancel
                        </button>

                        <button type="submit" className="button button--primary">
                            {tripToEdit ? "Save changes" : "Create trip"}
                        </button>
                    </div>
                </form>
            </section>
        </div>
    )
}

export default CreateTripModal