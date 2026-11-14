import "../styles/loaders.css"
import "./Spinner.css"
interface SpinnerProps {
    message?: string
}

export function Spinner({ message = "Loading..." }: SpinnerProps) {
    return (
        <div className="loading" role="status" aria-live="polite">
            <span className="big-loader" aria-hidden="true"></span>
            <p>{message}</p>
        </div>
    )
}