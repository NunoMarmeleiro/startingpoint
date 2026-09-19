import { 
    type PointOfInterest,
    poiCategoryLabels
} from "../../models/PointOfInterest"
import "./POICard.css"

type POICardProps = {
    poi: PointOfInterest
}

function POICard({ poi }: POICardProps) {
    return (
        <article className="card poi-card">
            <div className="card__header">
                <div>
                    <h3>{poi.name}</h3>
                    <span className="poi-card__category">
                        {poiCategoryLabels[poi.category]}
                    </span>
                </div>
            </div>

            {poi.description && (
                <p className="poi-card__description">
                    {poi.description}
                </p>
            )}

            {poi.address && (
                <p className="poi-card__address">
                    {poi.address}
                </p>
            )}

            {poi.notes && (
                <p className="poi-card__notes">
                    {poi.notes}
                </p>
            )}
        </article>
    )
}

export default POICard