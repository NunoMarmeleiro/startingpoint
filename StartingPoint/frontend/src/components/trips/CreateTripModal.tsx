import { useState } from "react"
import { createTrip } from "../../services/tripService"
import "./CreateTripModal.css"
import type { Trip } from "../../models/Trip"
import * as React from "react";

type CreateTripModalProps = {
    onClose: () => void
    onCreated: (trip: Trip) => void
}

function CreateTripModal({ onClose, onCreated }: CreateTripModalProps) {
    const [isClosing, setIsClosing] = useState(false)

    const [name, setName] = useState("")
    const [destination, setDestination] = useState("")

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

        const createdTrip = await createTrip({
            name,
            destination,
        })

        onCreated(createdTrip)
        handleClose()
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
                        <h2>Create a new trip</h2>
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

                <form
                    className="create-trip__form"
                    onSubmit={handleSubmit}
                >
                    <div className="form-field">
                        <label htmlFor="name">Trip name</label>

                        <input
                            id="name"
                            type="text"
                            value={name}
                            onChange={(event) => setName(event.target.value)}
                            placeholder="e.g. Japan Adventure"
                        />
                    </div>

                    <div className="form-field">
                        <label htmlFor="destination">Destination</label>

                        <input
                            id="destination"
                            type="text"
                            value={destination}
                            onChange={(event) =>
                                setDestination(event.target.value)
                            }
                            placeholder="e.g. Tokyo, Japan"
                        />
                    </div>

                    <div className="create-trip__actions">
                        <button
                            type="button"
                            className="button button--secondary"
                            onClick={handleClose}
                        >
                            Cancel
                        </button>

                        <button
                            type="submit"
                            className="button button--primary"
                        >
                            Create Trip
                        </button>
                    </div>
                </form>
            </section>
        </div>
    )
}

export default CreateTripModal