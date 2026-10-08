import { Routes, Route } from "react-router-dom"
import TripList from "./components/trips/TripList"
import TripDetailsPage from "./pages/trips/TripDetailsPage"
import { Toaster } from "sonner"

function App() {
    return (
        <main className="page">
            <Toaster 
                position="top-right" 
                richColors 
            />
            <Routes>
                <Route path="/" element={<TripList />} />
                <Route path="/trips/:id" element={<TripDetailsPage />} />
            </Routes>
        </main>
    )
}

export default App