import { Navigate, Outlet } from "react-router-dom"
import { useAuthentication } from "../../contexts/AuthenticationContext"
import "./ProtectedRoute.css"

export default function ProtectedRoute() {
    const { isAuthenticated, isLoading } = useAuthentication()

    if (isLoading) {
        return (
        <div className="protected-route__loading">
            <span className="big-loader"></span>
            <p>Loading...</p>
        </div>
        )
    }

    if (!isAuthenticated) {
        return <Navigate to="/login" replace />
    }

    return <Outlet />
}