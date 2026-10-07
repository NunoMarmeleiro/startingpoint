import { useNavigate } from "react-router-dom"
import type { Trip } from "../../models/Trip"
import "./TripCard.css"

type TripCardProps = {
    trip: Trip
    onDelete: (trip: Trip) => void
}

function TripCard({
                      trip,
                      onDelete,
                  }: TripCardProps) {
    const navigate = useNavigate();
    
    return (
        <article className="card trip-card">
            <h2 className="card__header trip-card__header">{trip.name}</h2>

            <div className="trip-card__content">
                <p className="trip-card__destination">
                    {trip.destination}
                </p>
    
                <p className="trip-card__dates">
                    {trip.startDate} → {trip.endDate}
                </p>
            </div>
            <div className="trip-card__actions">
                <button
                    type="button"
                    className="button button--secondary"
                    onClick={() => navigate(`/trips/${trip.id}`)}
                >
                    Edit
                </button>
                
                
                <button
                    type="button"
                    className="button button--danger"
                    onClick={(event) => {
                        event.preventDefault()
                        event.stopPropagation()
                        onDelete(trip)
                    }}
                >
                    Delete
                </button>
            </div>
            
        </article>
    
    )
}

export default TripCard