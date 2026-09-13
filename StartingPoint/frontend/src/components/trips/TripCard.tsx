import "./TripCard.css"

type TripCardProps = {
    name: string
    destination: string
}

function TripCard({ name, destination }: TripCardProps) {
    return (
        <article className="trip-card">
            <h2 className="trip-card__name">{name}</h2>
            <p className="trip-card__destination">{destination}</p>
        </article>
    )
}

export default TripCard