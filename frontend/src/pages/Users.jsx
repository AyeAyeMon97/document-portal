import { useState } from "react";

import Input from "../components/common/Input";
import Button from "../components/common/Button";
import ErrorMessage from "../components/common/ErrorMessage";

import userService from "../services/userService";

import { getErrorMessage, } from "../utils/errorHandler";

export default function Users() {
    const [form, setForm] = useState({
        name: "",
        email: "",
        password: "",
        role: "member",
    });

    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");
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
        setMessage("");

        try {
            setLoading(true);

            await userService.create(
                form
            );

            setMessage("User created successfully.");

            setForm({
                name: "",
                email: "",
                password: "",
                role: "member",
            });
        } catch (error) {
            setError(getErrorMessage(error));
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <h1> User Management</h1>
            <div className="card">
                <h2> Create Team Account</h2>
                {message && (
                    <div className="success-message">
                        {message}
                    </div>
                )}

                <ErrorMessage message={error} />

                <form onSubmit={handleSubmit} >

                    <Input
                        label="Name"
                        name="name"
                        value={form.name}
                        onChange={handleChange}
                        required
                    />

                    <Input
                        label="Email"
                        name="email"
                        type="email"
                        value={form.email}
                        onChange={handleChange}
                        required
                    />

                    <Input
                        label="Password"
                        name="password"
                        type="password"
                        value={form.password}
                        onChange={handleChange}
                        required
                    />

                    <div className="form-group">

                        <label>  Role </label>

                        <select
                            name="role"
                            value={form.role}
                            onChange={handleChange}
                            className="input"
                        >
                            <option value="member">  Member </option>

                            <option value="admin">    Admin </option>
                        </select>

                    </div>

                    <Button
                        type="submit"
                        loading={loading}
                    >
                        Create User
                    </Button>

                </form>

            </div>

        </div>
    );
}