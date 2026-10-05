import { 
    type PointOfInterest,
    poiCategoryMetadata
} from "../../models/PointOfInterest"
import "./POICard.css"
import * as React from "react";

type POICardProps = {
    poi: PointOfInterest,
    onEdit: (poi: PointOfInterest) => void,
    onDelete: (poi: PointOfInterest) => void
}

function POICard({ poi, onEdit, onDelete }: POICardProps) {
    return (
        <article className="card poi-card">
            <div className="card__header">
                <div>
                    <h3>{poi.name}</h3>
                    <span
                        className="poi-card__category"
                        style={{
                            "--color-poi-category":
                            poiCategoryMetadata[poi.category].color,
                        } as React.CSSProperties}
                    >
                        {poiCategoryMetadata[poi.category].label}
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

                <button
                    type="button"
                    className="button button--danger"
                    onClick={() => onDelete(poi)}
                >
                    Delete
                </button>
            </div>
        </article>
    )
}

export default POICard