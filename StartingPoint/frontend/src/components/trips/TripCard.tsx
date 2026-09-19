import { Link } from "react-router-dom"
import type { Trip } from "../../models/Trip"
import "./TripCard.css"

function TripCard({ trip }: { trip: Trip }) {
    return (
        <Link to={`/trips/${trip.id}`} className="card trip-card">
            <h2 className="trip-card__name">{trip.name}</h2>

            <p className="trip-card__destination">
                {trip.destination}
            </p>

            <p className="trip-card__dates">
                {trip.startDate} → {trip.endDate}
            </p>
        </Link>
    )
}

export default TripCard