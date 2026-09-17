import { useEffect, useState } from "react"
import type { Trip } from "../../models/Trip"
import { getTrips } from "../../services/tripService"
import TripCard from "./TripCard"
import "./TripList.css"
import CreateTripModal from "./CreateTripModal"

function TripList() {
    const [trips, setTrips] = useState<Trip[]>([])
    const [isCreateTripOpen, setIsCreateTripOpen] = useState(false)
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        async function loadTrips() {
            try {
                const data = await getTrips()
                setTrips(data)
            } finally {
                setIsLoading(false)
            }
        }

        loadTrips()
    }, [])

    return (
        <section className="trip-list">
            <header className="trip-list__header">
                <h1 className="trip-list__title">My Trips</h1>

                <button
                    className="button button--primary"
                    onClick={() => setIsCreateTripOpen(true)}
                >
                    + New Trip
                </button>
            </header>

            {isLoading ? (
                <div className="trip-list__loading">
                    <p>Loading your trips...</p>
                </div>
            ) : trips.length === 0 ? (
                <div className="trip-list__empty">
                    <h2>No trips yet</h2>

                    <p>
                        You don't have any trips yet. Create your first trip
                        and start planning your adventure!
                    </p>

                    <button
                        className="button button--primary"
                        onClick={() => setIsCreateTripOpen(true)}
                    >
                        Create your first trip
                    </button>
                </div>
            ) : (
                <div className="trip-list__grid">
                    {trips.map((trip) => (
                        <TripCard
                            key={trip.id}
                            name={trip.name}
                            destination={trip.destination}
                            startDate={trip.startDate}
                            endDate={trip.endDate}
                        />
                    ))}
                </div>
            )}
            {isCreateTripOpen && (
                <CreateTripModal
                    onClose={() => setIsCreateTripOpen(false)}
                    onCreated={(trip) => {
                        setTrips((currentTrips) => [...currentTrips, trip])
                    }}
                />
            )}
        </section>
        
        
    )
}

export default TripList