import {useEffect, useState} from "react"
import {Link, useNavigate, useParams} from "react-router-dom"
import {deletePointOfInterest, deleteTrip, getTripById} from "../../services/tripService"
import { toast } from "sonner"
import type {Trip} from "../../models/Trip"
import TripModal from "../../components/trips/TripModal"
import "./TripDetailsPage.css"
import POIModal from "../../components/pois/POIModal"
import POICard from "../../components/pois/POICard"
import type {PointOfInterest} from "../../models/PointOfInterest.ts";
import {getErrorMessage} from "../../utils/getErrorMessages.ts";
import ConfirmDialog from "../../common/ConfirmDialog.tsx";

function TripDetailsPage() {
    const navigate = useNavigate();
    const { id } = useParams<{ id: string }>()
    const [isEditModalOpen, setIsEditModalOpen] = useState(false)
    const [isAddPOIModalOpen, setIsAddPOIModalOpen] = useState(false)
    const [poiToEdit, setPoiToEdit] =
        useState<PointOfInterest | null>()
    const [trip, setTrip] = useState<Trip | null>(null)
    const [isLoading, setIsLoading] = useState(true)
    const [poiToDelete, setPoiToDelete] = useState<PointOfInterest | null>(null)
    const [tripToDelete, setTripToDelete] = useState<Trip | null>(null)
    
    useEffect(() => {
        if (!id) {
            return
        }
        const tripId = id
        async function loadTrip() {
            try {
                const data = await getTripById(tripId)
                setTrip(data)
            } catch (error: unknown) {
                toast.error(getErrorMessage(error))
            } finally {
                setIsLoading(false);
            }
            
        }

        loadTrip()
    }, [id])

    async function confirmDeleteTrip() {
        if (!tripToDelete) return

        try {
            await deleteTrip(tripToDelete.id)
            
            toast.success("Trip deleted successfully.")
            navigate('/')
        } catch (error) {
            toast.error(getErrorMessage(error))
        }
    }

    function handleDeleteTrip(trip: Trip) {
        setTripToDelete(trip)
    }
    
    function handleDeletePOI(poi: PointOfInterest) {
        setPoiToDelete(poi)
    }
    
    async function confirmDeletePOI() {
        if(!id) return
        if (!poiToDelete) return
        
        try {
            await deletePointOfInterest(
                id,
                poiToDelete.id
            )
    
            const updatedTrip = await getTripById(id)
            setTrip(updatedTrip)
            toast.success("Point of interest deleted successfully.")
        } catch (error: unknown) {
            toast.error(getErrorMessage(error))
        }
    }

    async function handleSavePOI() {
        if (!id) {
            return
        }
        try {
            const updatedTrip = await getTripById(id)
            setTrip(updatedTrip)
        } catch {
            toast.error("Failed to update trip data. Please try again.")
        }
    }

    return (
        <main>
            <Link
                to="/"
                className="trip-details__back"
            >
                ← Back to trips
            </Link>

            {isLoading ? (
                <div className="trip-details__loading">
                    <span className="big-loader"></span>
                    <p>Loading trip...</p>
                </div>
            ) : !trip ? (
                <div className="trip-details__empty">
                    <h2>Unable to load trip</h2>
                    <p>
                        We couldn't find this trip or something went wrong while
                        loading it.
                    </p>

                    <button
                        onClick={() => navigate("/")}
                        className="button button--primary"
                    >
                        Back to trips
                    </button>
                </div>
            ) : (
                <section className="trip-details">
                    <header className="trip-details__header">
                        <div>
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
                        <div className="trip-details__actions">
                            <button
                                type="button"
                                className="button button--secondary"
                                onClick={() => setIsEditModalOpen(true)}
                            >
                                Edit
                            </button>
                            <button
                                type="button"
                                className="button button--danger"
                                onClick={() => handleDeleteTrip(trip)}
                            >
                                Delete
                            </button>
                        </div>
                    </header>

                    <section className="trip-details__poi">
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
                                onClick={() => {
                                    setPoiToEdit(null)
                                    setIsAddPOIModalOpen(true)
                                }}
                            >
                                + Add POI
                            </button>
                        </div>

                        {trip.pointsOfInterest.length === 0 ? (
                            <div className="poi-list__empty">
                                <h3>No places added yet</h3>
                                <p>
                                    You don't have any places yet. Add your first
                                    point of interest to start building your trip.
                                </p>

                                <button
                                    type="button"
                                    className="button button--primary"
                                    onClick={() => {
                                        setPoiToEdit(null)
                                        setIsAddPOIModalOpen(true)
                                    }}
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
                                        onEdit={(selectedPOI) => {
                                            setPoiToEdit(selectedPOI)
                                            setIsAddPOIModalOpen(true)
                                        }}
                                        onDelete={handleDeletePOI}
                                    />
                                ))}
                            </div>
                        )}
                    </section>

                    {isEditModalOpen && (
                        <TripModal
                            tripToEdit={trip}
                            onClose={() => setIsEditModalOpen(false)}
                            onUpdated={(updatedTrip) => {
                                setTrip(updatedTrip)
                            }}
                        />
                    )}

                    {isAddPOIModalOpen && (
                        <POIModal
                            tripId={trip.id}
                            poiToEdit={poiToEdit}
                            onClose={() => {
                                setIsAddPOIModalOpen(false)
                                setPoiToEdit(null)
                            }}
                             onSaved={handleSavePOI}
                        />
                    )}
                    <ConfirmDialog
                        open={poiToDelete !== null}
                        onOpenChange={(open) => {
                            if (!open) {
                                setPoiToDelete(null)
                            }
                        }}
                        title="Delete Point of Interest?"
                        description={`Are you sure you want to delete "${poiToDelete?.name ?? ""}"? This action cannot be undone.`}
                        confirmLabel="Delete POI"
                        onConfirm={confirmDeletePOI}
                    />
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
            )}
        </main>
    )
}

export default TripDetailsPage