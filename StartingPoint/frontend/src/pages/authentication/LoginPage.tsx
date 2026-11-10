import { useState } from "react";
import type { SyntheticEvent } from "react";
import type { LoginUserRequest } from "../../models/authentication/ApplicationUser";
import * as React from "react";
import {getErrorMessage} from "../../utils/getErrorMessages.ts";
import {toast} from "sonner";
import { useAuthentication } from "../../contexts/AuthenticationContext"
import {Link} from "react-router-dom"
import "./LoginPage.css"
import {startAuthorization} from "../../services/authorization/authorization.ts";

export default function LoginPage() {
    const { login } = useAuthentication()
    const [formData, setFormData] = useState<LoginUserRequest>({
        emailOrUsername: "",
        password: ""
    });

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = event.target;

        setFormData(previous => ({
            ...previous,
            [name]: value
        }));
    };

    const handleSubmit = async (event: SyntheticEvent<HTMLFormElement>) => {
        event.preventDefault()

        try {
            await login(formData)
            await startAuthorization()
        } catch (error: unknown) {
            toast.error(getErrorMessage(error))
        }
    }

    return (
        <div className="login-page">
            <div className="login-card">
                <div className="login-header">
                    <h1>Welcome back</h1>
                    <p>Sign in to continue planning your trips.</p>
                </div>

                <form className="login-form" onSubmit={handleSubmit}>
                    <div className="login-form-group">
                        <label htmlFor="emailOrUsername">Email or username</label>
                        <input
                            id="emailOrUsername"
                            name="emailOrUsername"
                            value={formData.emailOrUsername}
                            onChange={handleChange}
                            placeholder="Enter your email"
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
                            placeholder="Enter your password"
                            required
                        />
                    </div>

                    <button className="button button--primary" type="submit">
                        Login
                    </button>
                </form>

                <div className="login-footer">
                    <p>Don't have an account? <Link to="/register">Register</Link></p>
                </div>
            </div>
        </div>
    )
}