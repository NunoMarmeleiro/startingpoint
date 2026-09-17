import { useEffect, useState } from "react"
import {Link, useParams} from "react-router-dom"
import { getTripById } from "../../services/tripService"
import type { Trip } from "../../models/Trip"
import "./TripDetailsPage.css"

function TripDetailsPage() {
    const { id } = useParams<{ id: string }>()

    const [trip, setTrip] = useState<Trip | null>(null)

    useEffect(() => {
        if (!id) {
            return
        }

        const tripId = id
        async function loadTrip() {
            const data = await getTripById(tripId)
            setTrip(data)
        }

        loadTrip()
    }, [id])

    if (!trip) {
        return (
            <main className="page">
                <p>Loading trip...</p>
            </main>
        )
    }

    return (
        <main className="page">
            <div className="trip-details">
                <header className="trip-details__header">
                    <div>
                        <Link
                            to="/"
                            className="trip-details__back"
                        >
                            ← Back to trips
                        </Link>

                        <h1 className="trip-details__name">
                            {trip.name}
                        </h1>

                        <p className="trip-details__destination">
                            {trip.destination}
                        </p>

                        <p className="trip-details__dates">
                            {trip.startDate} → {trip.endDate}
                        </p>
                    </div>

                    <button
                        type="button"
                        className="button button--secondary"
                    >
                        Edit
                    </button>
                </header>

                <section className="trip-details__pois">
                    <div className="trip-details__section-header">
                        <div>
                            <h2>Points of interest</h2>
                            <p>
                                Places you want to visit during your trip.
                            </p>
                        </div>

                        <button
                            type="button"
                            className="button button--primary"
                        >
                            + Add POI
                        </button>
                    </div>

                    <div className="trip-details__empty">
                        <h3>No places added yet</h3>

                        <p>
                            Add your first point of interest to start
                            building your trip.
                        </p>
                    </div>
                </section>
            </div>
        </main>
    )
}

export default TripDetailsPage