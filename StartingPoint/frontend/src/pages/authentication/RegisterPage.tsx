import { useState } from "react"
import type { SyntheticEvent, ChangeEvent } from "react"
import { Link, useNavigate } from "react-router-dom"
import { toast } from "sonner";
import type { RegisterUserRequest } from "../../models/authentication/ApplicationUser"
import { register } from "../../services/authenticationService"
import { getErrorMessage } from "../../utils/getErrorMessages"
import "./LoginPage.css"

export default function RegisterPage() {
    const navigate = useNavigate()

    const [formData, setFormData] = useState<RegisterUserRequest>({
        email: "",
        username: "",
        password: "",
    })

    const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
        const { name, value } = event.target

        setFormData(previous => ({
            ...previous,
            [name]: value,
        }))
    }

    const handleSubmit = async (event: SyntheticEvent<HTMLFormElement>) => {
        event.preventDefault()

        try {
            await register(formData)

            toast.success("Registration successful")
            navigate("/login")
        } catch (error: unknown) {
            toast.error(getErrorMessage(error))
        }
    }

    return (
        <div className="login-page">
            <div className="login-card">
                <div className="login-header">
                    <h1>Create an account</h1>
                    <p>Start planning your trips with StartingPoint.</p>
                </div>

                <form className="login-form" onSubmit={handleSubmit}>
                    <div className="login-form-group">
                        <label htmlFor="email">Email</label>
                        <input
                            id="email"
                            name="email"
                            type="email"
                            value={formData.email}
                            onChange={handleChange}
                            placeholder="Enter your email"
                            required
                        />
                    </div>

                    <div className="login-form-group">
                        <label htmlFor="username">Username</label>
                        <input
                            id="username"
                            name="username"
                            type="text"
                            value={formData.username}
                            onChange={handleChange}
                            placeholder="Choose a username"
                            required
                        />
                    </div>

                    <div className="login-form-group">
                        <label htmlFor="password">Password</label>
                        <input
                            id="password"
                            name="password"
                            type="password"
                            value={formData.password}
                            onChange={handleChange}
                            placeholder="Create a password"
                            required
                        />
                    </div>

                    <button className="button button--primary" type="submit">
                        Register
                    </button>
                </form>

                <div className="login-footer">
                    <p>
                        Already have an account? <Link to="/login">Login</Link>
                    </p>
                </div>
            </div>
        </div>
    )
}