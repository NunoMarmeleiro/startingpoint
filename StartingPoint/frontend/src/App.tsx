import { Routes, Route } from "react-router-dom"
import TripList from "./components/trips/TripList"

function App() {
    return (
        <main className="page">
            <Routes>
                <Route path="/" element={<TripList />} />
            </Routes>
        </main>
    )
}

export default App