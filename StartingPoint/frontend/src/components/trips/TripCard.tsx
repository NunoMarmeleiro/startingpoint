import { Link } from "react-router-dom"
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
    return (
        <Link to={`/trips/${trip.id}`} className="card trip-card">
            <h2 className="trip-card__name">{trip.name}</h2>

            <p className="trip-card__destination">
                {trip.destination}
            </p>

            <p className="trip-card__dates">
                {trip.startDate} → {trip.endDate}
            </p>

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
        </Link>
    
    )
}

export default TripCard