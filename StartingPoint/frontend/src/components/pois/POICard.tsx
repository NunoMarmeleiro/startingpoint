import { 
    type PointOfInterest,
    poiCategoryLabels
} from "../../models/PointOfInterest"
import "./POICard.css"

type POICardProps = {
    poi: PointOfInterest,
    onEdit: (poi: PointOfInterest) => void
}

function POICard({ poi, onEdit }: POICardProps) {
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

            <div className="poi-card__actions">
                <button
                    type="button"
                    className="button button--secondary"
                    onClick={() => onEdit(poi)}
                >
                    Edit
                </button>
            </div>
        </article>
    )
}

export default POICard