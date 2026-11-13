import { Navigate, Outlet } from "react-router-dom"
import { useAuthentication } from "../../contexts/AuthenticationContext"
import {Spinner} from "../../common/Spinner.tsx";

export default function ProtectedRoute() {
    const { isAuthenticated, isLoading } = useAuthentication()

    if (isLoading) {
        return (
            <Spinner />
        )
    }

    if (!isAuthenticated && !isLoading) {
        return <Navigate to="/login" replace />
    }

    return <Outlet />
}