import { Navigate, Outlet } from "react-router-dom"
import { useAuthentication } from "../../contexts/AuthenticationContext"
import {Spinner} from "../../common/Spinner.tsx";

export default function PublicRoute() {
    const { isAuthenticated, isLoading } = useAuthentication()

    if (isLoading) {
        return (
            <Spinner />
        )
    }

    if (isAuthenticated) {
        return <Navigate to="/" replace />
    }

    return <Outlet />
}