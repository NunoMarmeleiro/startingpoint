import { Routes, Route } from "react-router-dom"
import TripList from "./components/trips/TripList"
import TripDetailsPage from "./pages/trips/TripDetailsPage"
import { Toaster } from "sonner"
import LoginPage from "./pages/authentication/LoginPage.tsx";
import RegisterPage from "./pages/authentication/RegisterPage.tsx";
import ProtectedRoute from "./components/authentication/ProtectedRoute.tsx";
import PublicRoute from "./components/authentication/PublicRoute.tsx";
import MainLayout from "./components/layout/MainLayout.tsx";

function App() {
    return (
        <main className="page">
            <Toaster 
                position="top-right" 
                richColors 
            />
            <Routes>
                <Route element={<PublicRoute />}>
                    <Route path="/login" element={<LoginPage />} />
                    <Route path="/register" element={<RegisterPage />} />
                </Route>
                <Route element={<ProtectedRoute />}>
                    <Route element={<MainLayout />}>
                        <Route path="/" element={<TripList />} />
                        <Route path="/trips/:id" element={<TripDetailsPage />} />
                    </Route>
                </Route>
                
            </Routes>
        </main>
    )
}

export default App