import { useState } from "react"
import * as React from "react"
import { createTrip, updateTrip } from "../../services/tripService"
import type { Trip } from "../../models/Trip"

type CreateTripModalProps = {
    onCreated?: (trip: Trip) => void
    onUpdated?: (trip: Trip) => void
    onClose: () => void
    tripToEdit?: Trip | null
}

function CreateTripModal({
                             onClose,
                             onCreated,
                             onUpdated,
                             tripToEdit,
                         }: CreateTripModalProps) {
    const [isClosing, setIsClosing] = useState(false)
    const [isSubmitting, setIsSubmitting] = useState(false)

    const [name, setName] = useState(tripToEdit?.name ?? "")
    const [destination, setDestination] = useState(
        tripToEdit?.destination ?? ""
    )
    const [startDate, setStartDate] = useState(
        tripToEdit?.startDate ?? ""
    )
    const [endDate, setEndDate] = useState(
        tripToEdit?.endDate ?? ""
    )

    const [dateError, setDateError] = useState("")
    const [error, setError] = useState("")

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
        setIsSubmitting(true)

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
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <div
            className={`modal-backdrop ${
                isClosing ? "modal-backdrop--closing" : ""
            }`}
            onClick={(event) => {
                if (event.target === event.currentTarget) {
                    handleClose()
                }
            }}
        >
            <section
                className={`modal ${
                    isClosing ? "modal--closing" : ""
                }`}
                onAnimationEnd={handleAnimationEnd}
            >
                <header className="modal__header">
                    <div>
                        <h2>
                            {tripToEdit ? "Edit trip" : "Create trip"}
                        </h2>

                        <p>Plan your next adventure.</p>
                    </div>

                    <button
                        type="button"
                        className="modal__close"
                        onClick={handleClose}
                        aria-label="Close"
                    >
                        ×
                    </button>
                    
                </header>

                {error && (
                    <p className="modal__error">
                        {error}
                    </p>
                )}
                <div className="modal__content">
                    <form
                        id="create-trip-form"
                        className="modal__form"
                        onSubmit={handleSubmit}
                    >
                        
                        
                        <div className="modal__field">
                            <label htmlFor="name">
                                Trip name{" "}
                                <span className="required">*</span>
                            </label>
    
                            <input
                                id="name"
                                type="text"
                                value={name}
                                onChange={(event) =>
                                    setName(event.target.value)
                                }
                                placeholder="e.g. Japan Adventure"
                                required
                            />
                        </div>
    
                        <div className="modal__field">
                            <label htmlFor="destination">
                                Destination{" "}
                                <span className="required">*</span>
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
    
                        <div className="modal__field">
                            <label htmlFor="startDate">
                                Start date{" "}
                                <span className="required">*</span>
                            </label>
    
                            <input
                                id="startDate"
                                type="date"
                                value={startDate}
                                onChange={(event) =>
                                    setStartDate(event.target.value)
                                }
                                required
                            />
                        </div>
    
                        <div className="modal__field">
                            <label htmlFor="endDate">
                                End date{" "}
                                <span className="required">*</span>
                            </label>
    
                            <input
                                id="endDate"
                                type="date"
                                value={endDate}
                                min={startDate}
                                onChange={(event) =>
                                    setEndDate(event.target.value)
                                }
                                required
                            />
                        </div>
    
                        {dateError && (
                            <p className="form-field__error">
                                {dateError}
                            </p>
                        )}
                    </form>
                </div>
                <div className="modal__actions">
                    <button
                        type="button"
                        className="button button--secondary"
                        onClick={handleClose}
                        disabled={isSubmitting}
                    >
                        Cancel
                    </button>

                    <button
                        type="submit"
                        form="create-trip-form"
                        className="button button--primary"
                        disabled={isSubmitting}
                    >
                        {tripToEdit ?
                            !isSubmitting ? "Save changes" : "Saving..."
                            : 
                            !isSubmitting ? "Create trip" : "Creating..."
                        }
                    </button>
                </div>
                
            </section>
        </div>
    )
}

export default CreateTripModal