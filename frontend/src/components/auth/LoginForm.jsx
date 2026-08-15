import { useState } from "react";
import { useNavigate } from "react-router-dom";

import Input from "../common/Input";
import Button from "../common/Button";
import ErrorMessage from "../common/ErrorMessage";

import authController from "../../controllers/authController";
import useAuth from "../../hooks/useAuth";
import { getErrorMessage, } from "../../utils/errorHandler";

export default function LoginForm() {
    const navigate = useNavigate();
    const { login } = useAuth();

    const [form, setForm] = useState({
        email: "",
        password: "",
    });

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleChange = (e) => {
        setForm({
            ...form,
            [e.target.name]:
                e.target.value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        try {
            setLoading(true);
            const user = await authController.login(form);
            login(user);
            navigate("/documents", {
                replace: true,
            }
            );
        } catch (error) {
            setError(getErrorMessage(error));
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="login-form" >
            <h2>
                Internal Document Portal
            </h2>

            <Input
                label="Email"
                name="email"
                type="email"
                value={form.email}
                onChange={handleChange}
                placeholder="admin@workspace.com"
                required
            />
            <Input
                label="Password"
                name="password"
                type="password"
                value={form.password}
                onChange={handleChange}
                placeholder="Password"
                required
            />
            <ErrorMessage message={error} />

            <Button type="submit" loading={loading}>
                Login
            </Button>
        </form>
    );
}