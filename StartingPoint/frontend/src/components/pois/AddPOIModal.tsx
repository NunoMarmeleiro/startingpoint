import { useState } from "react"
import * as React from "react"
import { addPointOfInterest } from "../../services/tripService"
import {
    type AddPointOfInterestRequest,
    type POICategory, 
    poiCategoryLabels
} from "../../models/PointOfInterest"


type AddPOIModalProps = {
    tripId: string
    onAdded?: () => void
    onClose: () => void
}

const categories: POICategory[] = [
    "Attraction",
    "Museum",
    "HistoricalSite",
    "Restaurant",
    "Cafe",
    "Bar",
    "Park",
    "Shopping",
    "Accommodation",
    "Other",
]



function AddPOIModal({
    tripId,
    onAdded,
    onClose,
}: AddPOIModalProps) {
    const [name, setName] = useState("")
    const [category, setCategory] =
        useState<POICategory>("Attraction")
    const [description, setDescription] = useState("")
    const [address, setAddress] = useState("")
    const [notes, setNotes] = useState("")
    const [error, setError] = useState("")
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [isClosing, setIsClosing] = useState(false)

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
        if (!name.trim()) {
            setError("Name is required.")
            return
        }

        setError("")
        setIsSubmitting(true)

        const request: AddPointOfInterestRequest = {
            name,
            category,
            description: description || undefined,
            address: address || undefined,
            notes: notes || undefined,
        }

        try {
            await addPointOfInterest(tripId, request)

            onAdded?.()
            handleClose()
        } catch {
            setError(
                "Something went wrong while adding the point of interest. Please try again."
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
                        <h2>Add point of interest</h2>
                        <p>
                            Add a place you want to visit during your trip.
                        </p>
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
                        id="add-poi-form"
                        className="modal__form"
                        onSubmit={handleSubmit}
                    >
                        <div className="modal__field">
                            <label htmlFor="poi-name">
                                Name
                            </label>
    
                            <input
                                id="poi-name"
                                type="text"
                                value={name}
                                onChange={(event) =>
                                    setName(event.target.value)
                                }
                                required
                            />
                        </div>
    
                        <div className="modal__field">
                            <label htmlFor="poi-category">
                                Category
                            </label>
    
                            <select
                                id="poi-category"
                                value={category}
                                onChange={(event) =>
                                    setCategory(
                                        event.target.value as POICategory
                                    )
                                }
                            >
                                {categories.map((item) => (
                                    <option key={item} value={item}>
                                        {poiCategoryLabels[item]}
                                    </option>
                                ))}
                            </select>
                        </div>
    
                        <div className="modal__field">
                            <label htmlFor="poi-description">
                                Description
                            </label>
    
                            <textarea
                                id="poi-description"
                                value={description}
                                onChange={(event) =>
                                    setDescription(event.target.value)
                                }
                            />
                        </div>
    
                        <div className="modal__field">
                            <label htmlFor="poi-address">
                                Address
                            </label>
    
                            <input
                                id="poi-address"
                                type="text"
                                value={address}
                                onChange={(event) =>
                                    setAddress(event.target.value)
                                }
                            />
                        </div>
    
                        <div className="modal__field">
                            <label htmlFor="poi-notes">
                                Notes
                            </label>
    
                            <textarea
                                id="poi-notes"
                                value={notes}
                                onChange={(event) =>
                                    setNotes(event.target.value)
                                }
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
                        form="add-poi-form"
                        className="button button--primary"
                        disabled={isSubmitting}
                    >
                        {isSubmitting ?
                            "Adding..."
                            :
                            "Add POI"
                        }
                    </button>
                </div>
            </section>
        </div>
    )
}

export default AddPOIModal
