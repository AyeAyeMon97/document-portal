import { useCallback, useEffect, useState } from "react";

import Input from "../components/common/Input";
import Button from "../components/common/Button";
import Modal from "../components/common/Modal";
import Loading from "../components/common/Loading";
import ErrorMessage from "../components/common/ErrorMessage";

import userService from "../services/userService";
import roleService from "../services/roleService";
import { getErrorMessage } from "../utils/errorHandler";

const emptyForm = {
    name: "",
    email: "",
    password: "",
    role_id: "",
};

export default function Users() {
    const [users, setUsers] = useState([]);
    const [roles, setRoles] = useState([]);
    const [form, setForm] = useState(emptyForm);
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [listLoading, setListLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");
    const [formError, setFormError] = useState("");

    const loadUsers = useCallback(async () => {
        try {
            setListLoading(true);
            setError("");
            const response = await userService.getAll();
            setUsers(response.data || []);
        } catch (err) {
            setError(getErrorMessage(err));
        } finally {
            setListLoading(false);
        }
    }, []);

    const loadRoles = useCallback(async () => {
        try {
            const response = await roleService.getAll();
            const roleList = response.data || [];
            setRoles(roleList);

            const memberRole = roleList.find((role) => role.slug === "member");
            setForm((current) => ({
                ...current,
                role_id: current.role_id || memberRole?.id || roleList[0]?.id || "",
            }));
        } catch (err) {
            setError(getErrorMessage(err));
        }
    }, []);

    useEffect(() => {
        loadUsers();
        loadRoles();
    }, [loadUsers, loadRoles]);

    const handleChange = (e) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value,
        });
    };

    const openCreateModal = () => {
        const memberRole = roles.find((role) => role.slug === "member");
        setForm({
            ...emptyForm,
            role_id: memberRole?.id || roles[0]?.id || "",
        });
        setFormError("");
        setShowCreateModal(true);
    };

    const closeModal = () => {
        setShowCreateModal(false);
        setFormError("");
        setForm(emptyForm);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setFormError("");
        setMessage("");

        try {
            setSaving(true);
            await userService.create(form);
            setMessage("User created successfully.");
            closeModal();
            await loadUsers();
        } catch (err) {
            setFormError(getErrorMessage(err));
        } finally {
            setSaving(false);
        }
    };

    return (
        <div>
            <div className="page-header page-header-row">
                <div>
                    <h1>User Management</h1>
                    <p>View team accounts and create new users</p>
                </div>
                <Button onClick={openCreateModal}>Create User</Button>
            </div>

            {message && <div className="success-message">{message}</div>}
            <ErrorMessage message={error} />

            <div className="card">
                <div className="card-header">
                    <h2>Team Accounts</h2>
                </div>

                {listLoading ? (
                    <Loading text="Loading users..." />
                ) : users.length === 0 ? (
                    <div className="empty-state">No users found.</div>
                ) : (
                    <div className="table-wrap">
                        <table className="data-table">
                            <thead>
                                <tr>
                                    <th>Name</th>
                                    <th>Email</th>
                                    <th>Role</th>
                                    <th>Permissions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {users.map((user) => (
                                    <tr key={user.id}>
                                        <td>{user.name}</td>
                                        <td>{user.email}</td>
                                        <td>
                                            <span className="badge">
                                                {user.role_detail?.name ||
                                                    user.role}
                                            </span>
                                        </td>
                                        <td>
                                            <span className="muted-text">
                                                {(user.permissions || []).length}{" "}
                                                assigned
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            <Modal
                open={showCreateModal}
                title="Create Team Account"
                onClose={closeModal}
            >
                <form className="modal-form" onSubmit={handleSubmit}>
                    <ErrorMessage message={formError} />

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
                        <label htmlFor="role_id">Role</label>
                        <select
                            id="role_id"
                            name="role_id"
                            value={form.role_id}
                            onChange={handleChange}
                            className="input"
                            required
                        >
                            <option value="" disabled>
                                Select a role
                            </option>
                            {roles.map((role) => (
                                <option key={role.id} value={role.id}>
                                    {role.name}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="modal-actions">
                        <Button
                            type="button"
                            className="btn-secondary"
                            onClick={closeModal}
                            disabled={saving}
                        >
                            Cancel
                        </Button>
                        <Button type="submit" loading={saving}>
                            Create User
                        </Button>
                    </div>
                </form>
            </Modal>
        </div>
    );
}
