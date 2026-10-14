import { useEffect, useState } from "react"
import type { Trip } from "../../models/Trip"
import { getTrips } from "../../services/tripService"
import { toast } from "sonner"
import TripCard from "./TripCard"
import "./TripList.css"
import TripModal from "./TripModal"
import { deleteTrip } from "../../services/tripService"
import {getErrorMessage} from "../../utils/getErrorMessages.ts";
import ConfirmDialog from "../../common/ConfirmDialog.tsx";

function TripList() {
    const [trips, setTrips] = useState<Trip[]>([])
    const [isCreateTripOpen, setIsCreateTripOpen] = useState(false)
    const [isLoading, setIsLoading] = useState(true)
    const [tripToDelete, setTripToDelete] = useState<Trip | null>(null)

    useEffect(() => {
        async function loadTrips() {
            try {
                const data = await getTrips()
                setTrips(data)
            } catch (error: unknown) {
                toast.error(getErrorMessage(error))
            } finally {
                setIsLoading(false)
            }
        }

        loadTrips()
    }, [])

    async function confirmDeleteTrip() {
        if (!tripToDelete) return

        try {
            await deleteTrip(tripToDelete.id)

            setTrips((currentTrips) =>
                currentTrips.filter(
                    (trip) => trip.id !== tripToDelete.id
                )
            )

            toast.success("Trip deleted successfully.")
        } catch (error) {
            toast.error(getErrorMessage(error))
        }
    }

    function handleDeleteTrip(trip: Trip) {
        setTripToDelete(trip)
    }

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
                    <span className="big-loader"></span>
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
                            trip={trip}
                            onDelete={handleDeleteTrip}
                        />
                    ))}
                </div>
            )}
            {isCreateTripOpen && (
                <TripModal
                    onClose={() => setIsCreateTripOpen(false)}
                    onCreated={(trip) => {
                        setTrips((currentTrips) => [...currentTrips, trip])
                    }}
                />
            )}
            <ConfirmDialog
                open={tripToDelete !== null}
                onOpenChange={(open) => {
                    if (!open) {
                        setTripToDelete(null)
                    }
                }}
                title="Delete trip?"
                description={`Are you sure you want to delete "${tripToDelete?.name ?? ""}"? This action cannot be undone.`}
                confirmLabel="Delete trip"
                onConfirm={confirmDeleteTrip}
            />
        </section>
        
        
        
    )
}

export default TripList