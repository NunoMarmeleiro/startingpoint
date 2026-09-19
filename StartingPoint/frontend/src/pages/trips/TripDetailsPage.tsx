import { useEffect, useState } from "react"
import {Link, useParams} from "react-router-dom"
import { getTripById } from "../../services/tripService"
import type { Trip } from "../../models/Trip"
import CreateTripModal from "../../components/trips/CreateTripModal"
import "./TripDetailsPage.css"
import AddPOIModal from "../../components/pois/AddPOIModal"
import POICard from "../../components/pois/POICard"

function TripDetailsPage() {
    const { id } = useParams<{ id: string }>()
    const [isEditModalOpen, setIsEditModalOpen] = useState(false)
    const [isAddPOIModalOpen, setIsAddPOIModalOpen] = useState(false)
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
        <section className="trip-details">
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
                    onClick={() => setIsEditModalOpen(true)}
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
                        onClick={() => setIsAddPOIModalOpen(true)}
                    >
                        + Add POI
                    </button>
                </div>

                {trip.pointsOfInterest.length === 0 ? (
                <div className="pois-list__empty">
                    <h3>No places added yet</h3>
                    <p>
                        You don't have any place yet. Add your first 
                        point of interest to start building your trip.
                    </p>

                    <button
                        className="button button--primary"
                        onClick={() => setIsAddPOIModalOpen(true)}
                    >
                        Add your first place
                    </button>
                </div>
                    
                    
                ) : (
                    <div className="poi-list__grid">
                        {trip.pointsOfInterest.map((poi) => (
                            <POICard
                                key={poi.id}
                                poi={poi}
                            />
                        ))}
                    </div>
                )}
            </section>

            {isEditModalOpen && trip && (
                <CreateTripModal
                    tripToEdit={trip}
                    onClose={() => setIsEditModalOpen(false)}
                    onUpdated={(updatedTrip) => {
                        setTrip(updatedTrip)
                    }}
                />
            )}

            {isAddPOIModalOpen && trip && (
                <AddPOIModal
                    tripId={trip.id}
                    onClose={() => setIsAddPOIModalOpen(false)}
                    onAdded={async () => {
                        const updatedTrip = await getTripById(trip.id)
                        setTrip(updatedTrip)
                    }}
                />
            )}
        </section>
    )
}

export default TripDetailsPage