import { useState } from "react"
import { Outlet, NavLink } from "react-router-dom"
import { toast } from "sonner"

import { useAuthentication } from "../../contexts/AuthenticationContext"
import { getErrorMessage } from "../../utils/getErrorMessages"

import "./MainLayout.css"

export default function MainLayout() {
    const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false)

    const { user, logout } = useAuthentication()

    const handleLogout = async () => {
        try {
            logout()
        } catch (error: unknown) {
            toast.error(getErrorMessage(error))
        }
    }

    const toggleSidebar = () => {
        setIsSidebarCollapsed(previous => !previous)
    }

    return (
        <div className={`main-layout ${isSidebarCollapsed ? "main-layout--collapsed" : ""}`}>
            <aside className="sidebar">
                <div className="sidebar-header">
                    <span className="sidebar-logo">
                        {!isSidebarCollapsed && "StartingPoint"}
                    </span>

                    <button
                        className="sidebar-toggle"
                        type="button"
                        onClick={toggleSidebar}
                        aria-label={isSidebarCollapsed ? "Expand sidebar" : "Collapse sidebar"}
                        title={isSidebarCollapsed ? "Expand sidebar" : "Collapse sidebar"}
                    >
                        {isSidebarCollapsed ? "→" : "←"}
                    </button>
                </div>

                <nav className="sidebar-nav">
                    <NavLink to="/" end>
                        {!isSidebarCollapsed && "Trips"}
                        {isSidebarCollapsed && "T"}
                    </NavLink>
                </nav>

                <div className="sidebar-footer">
                    {!isSidebarCollapsed && (
                        <div className="sidebar-user">
                            <span>{user?.username}</span>
                        </div>
                    )}

                    <button
                        className="button button--secondary"
                        onClick={handleLogout}
                        title="Logout"
                    >
                        {isSidebarCollapsed ? "↪" : "Logout"}
                    </button>
                </div>
            </aside>

            <main className="main-content">
                <Outlet />
            </main>
        </div>
    )
}