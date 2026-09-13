import { useEffect, useState } from "react"
import type { Trip } from "../../models/Trip"
import { getTrips } from "../../services/tripService"
import TripCard from "./TripCard"
import "./TripList.css"
import CreateTripModal from "./CreateTripModal"

function TripList() {
    const [trips, setTrips] = useState<Trip[]>([])
    const [isCreateTripOpen, setIsCreateTripOpen] = useState(false)

    useEffect(() => {
        getTrips()
            .then((data) => setTrips(data))
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

            <div className="trip-list__grid">
                {trips.map((trip) => (
                    <TripCard
                        key={trip.id}
                        name={trip.name}
                        destination={trip.destination}
                    />
                ))}
            </div>
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