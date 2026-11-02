import { Navigate, Outlet } from "react-router-dom"
import { useAuthentication } from "../../contexts/AuthenticationContext"
import "./PublicRoute.css"

export default function PublicRoute() {
    const { isAuthenticated, isLoading } = useAuthentication()

    if (isLoading) {
        return (
            <div className="public-route__loading">
                <span className="big-loader"></span>
                <p>Loading...</p>
            </div>
        )
    }

    if (isAuthenticated) {
        return <Navigate to="/" replace />
    }

    return <Outlet />
}