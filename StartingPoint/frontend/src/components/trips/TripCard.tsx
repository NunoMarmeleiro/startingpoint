import "./TripCard.css"

type TripCardProps = {
    name: string
    destination: string
    startDate: string
    endDate: string
}

function TripCard({
                      name,
                      destination,
                      startDate,
                      endDate,
                  }: TripCardProps) {
    return (
        <article className="trip-card">
            <h2 className="trip-card__name">{name}</h2>

            <p className="trip-card__destination">
                {destination}
            </p>

            <p className="trip-card__dates">
                {startDate} → {endDate}
            </p>
        </article>
    )
}

export default TripCard