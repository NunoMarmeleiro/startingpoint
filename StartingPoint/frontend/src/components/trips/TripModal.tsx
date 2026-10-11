import { useState } from "react"
import { useRef } from "react";
import * as React from "react"
import { createTrip, updateTrip } from "../../services/tripService"
import type { Trip } from "../../models/Trip"
import { toast } from "sonner"

type CreateTripModalProps = {
    onCreated?: (trip: Trip) => void
    onUpdated?: (trip: Trip) => void
    onClose: () => void
    tripToEdit?: Trip | null
}

function TripModal({
                             onClose,
                             onCreated,
                             onUpdated,
                             tripToEdit,
                         }: CreateTripModalProps) {
    const [isClosing, setIsClosing] = useState(false)
    const [isSubmitting, setIsSubmitting] = useState(false)

    const [name, setName] = useState(tripToEdit?.name ?? "")
    const nameInputRef = useRef<HTMLInputElement>(null)
    
    const [destination, setDestination] = useState(
        tripToEdit?.destination ?? ""
    )
    const destinationInputRef = useRef<HTMLInputElement>(null)
    
    const [startDate, setStartDate] = useState(
        tripToEdit?.startDate ?? ""
    )
    const startDateInputRef = useRef<HTMLInputElement>(null)
    
    const [endDate, setEndDate] = useState(
        tripToEdit?.endDate ?? ""
    )
    const endDateInputRef = useRef<HTMLInputElement>(null)
    
    function handleClose() {
        if(isSubmitting) return
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
        
        if(!name.trim()){
            toast.error("Name is required.")
            nameInputRef.current?.focus()
            return
        }
        
        if(!destination.trim()){
            toast.error("Destination is required.")
            nameInputRef.current?.focus()
            return
        }
        
        if(!startDate.trim()){
            toast.error("Start date is required.")
            startDateInputRef.current?.focus()
        }
        
        if(!endDate.trim()){}
        
        if (endDate < startDate) {
            toast.error("End date cannot be before start date.")
            endDateInputRef.current?.focus();
            return
        }

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
                toast.success("Trip updated successfully.")
            } else {
                const createdTrip = await createTrip({
                    name,
                    destination,
                    startDate,
                    endDate,
                })
                onCreated?.(createdTrip)
                toast.success("Trip created successfully.")
            }

            handleClose()
        } catch {
            toast.error(
                tripToEdit
                    ? "Failed to update trip."
                    : "Failed to create trip."
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
                        disabled={isSubmitting}
                    >
                        ×
                    </button>
                    
                </header>
                <div className="modal__content">
                    <form
                        id="create-trip-form"
                        className="modal__form"
                        onSubmit={handleSubmit}
                    >
                        
                        
                        <div className="modal__field">
                            <label htmlFor="name">
                                Trip name{" "}
                                <span className="required" aria-hidden="true">*</span>
                            </label>
    
                            <input
                                ref={nameInputRef}
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
                                <span className="required" aria-hidden="true">*</span>
                            </label>
    
                            <input
                                ref={destinationInputRef}
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
                                ref={startDateInputRef}
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
                                ref={endDateInputRef}
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
                        {isSubmitting && <span className="small-loader"></span>}

                        {tripToEdit
                            ? isSubmitting
                                ? "Saving..."
                                : "Save changes"
                            : isSubmitting
                                ? "Creating..."
                                : "Create trip"
                        }
                    </button>
                </div>
                
            </section>
        </div>
    )
}

export default TripModal