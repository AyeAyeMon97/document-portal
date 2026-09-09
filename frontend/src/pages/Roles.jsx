import { useCallback, useEffect, useMemo, useState } from "react";

import Input from "../components/common/Input";
import Button from "../components/common/Button";
import Modal from "../components/common/Modal";
import Loading from "../components/common/Loading";
import ErrorMessage from "../components/common/ErrorMessage";

import roleService from "../services/roleService";
import permissionService from "../services/permissionService";
import { getErrorMessage } from "../utils/errorHandler";

const emptyRoleForm = {
    name: "",
    slug: "",
    description: "",
};

function groupPermissions(permissions) {
    return permissions.reduce((groups, permission) => {
        const group = permission.slug.split(".")[0] || "other";
        if (!groups[group]) {
            groups[group] = [];
        }
        groups[group].push(permission);
        return groups;
    }, {});
}

export default function Roles() {
    const [roles, setRoles] = useState([]);
    const [permissions, setPermissions] = useState([]);
    const [listLoading, setListLoading] = useState(true);
    const [error, setError] = useState("");
    const [message, setMessage] = useState("");

    const [showCreateModal, setShowCreateModal] = useState(false);
    const [showPermissionModal, setShowPermissionModal] = useState(false);
    const [selectedRole, setSelectedRole] = useState(null);
    const [roleForm, setRoleForm] = useState(emptyRoleForm);
    const [selectedPermissionIds, setSelectedPermissionIds] = useState([]);
    const [formError, setFormError] = useState("");
    const [saving, setSaving] = useState(false);

    const permissionGroups = useMemo(
        () => groupPermissions(permissions),
        [permissions]
    );

    const loadData = useCallback(async () => {
        try {
            setListLoading(true);
            setError("");

            const [rolesResponse, permissionsResponse] = await Promise.all([
                roleService.getAll(),
                permissionService.getAll(),
            ]);

            setRoles(rolesResponse.data || []);
            setPermissions(permissionsResponse.data || []);
        } catch (err) {
            setError(getErrorMessage(err));
        } finally {
            setListLoading(false);
        }
    }, []);

    useEffect(() => {
        loadData();
    }, [loadData]);

    const openCreateModal = () => {
        setRoleForm(emptyRoleForm);
        setSelectedPermissionIds([]);
        setFormError("");
        setShowCreateModal(true);
    };

    const openPermissionModal = (role) => {
        setSelectedRole(role);
        setSelectedPermissionIds(
            (role.permissions || []).map((permission) => permission.id)
        );
        setFormError("");
        setShowPermissionModal(true);
    };

    const closeModals = () => {
        setShowCreateModal(false);
        setShowPermissionModal(false);
        setSelectedRole(null);
        setFormError("");
        setRoleForm(emptyRoleForm);
        setSelectedPermissionIds([]);
    };

    const handleRoleFormChange = (e) => {
        setRoleForm({
            ...roleForm,
            [e.target.name]: e.target.value,
        });
    };

    const togglePermission = (permissionId) => {
        setSelectedPermissionIds((current) =>
            current.includes(permissionId)
                ? current.filter((id) => id !== permissionId)
                : [...current, permissionId]
        );
    };

    const handleCreateRole = async (e) => {
        e.preventDefault();
        setFormError("");
        setMessage("");

        try {
            setSaving(true);
            await roleService.create({
                ...roleForm,
                slug: roleForm.slug || undefined,
                permission_ids: selectedPermissionIds,
            });
            setMessage("Role created successfully.");
            closeModals();
            await loadData();
        } catch (err) {
            setFormError(getErrorMessage(err));
        } finally {
            setSaving(false);
        }
    };

    const handleSavePermissions = async (e) => {
        e.preventDefault();
        if (!selectedRole) {
            return;
        }

        setFormError("");
        setMessage("");

        try {
            setSaving(true);
            await roleService.syncPermissions(
                selectedRole.id,
                selectedPermissionIds
            );
            setMessage(`Permissions updated for ${selectedRole.name}.`);
            closeModals();
            await loadData();
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
                    <h1>Roles & Permissions</h1>
                    <p>Control what each role can create, edit, delete, or download</p>
                </div>
                <Button onClick={openCreateModal}>Create Role</Button>
            </div>

            {message && <div className="success-message">{message}</div>}
            <ErrorMessage message={error} />

            <div className="card">
                <div className="card-header">
                    <h2>All Roles</h2>
                </div>

                {listLoading ? (
                    <Loading text="Loading roles..." />
                ) : roles.length === 0 ? (
                    <div className="empty-state">No roles found.</div>
                ) : (
                    <div className="role-list">
                        {roles.map((role) => (
                            <div key={role.id} className="role-item">
                                <div className="role-item-info">
                                    <div className="role-item-title">
                                        <h3>{role.name}</h3>
                                        <span className="badge">{role.slug}</span>
                                    </div>
                                    <p className="muted-text">
                                        {role.description || "No description"}
                                    </p>
                                    <div className="permission-chips">
                                        {(role.permissions || []).length === 0 ? (
                                            <span className="muted-text">
                                                No permissions assigned
                                            </span>
                                        ) : (
                                            role.permissions.map((permission) => (
                                                <span
                                                    key={permission.id}
                                                    className="chip"
                                                >
                                                    {permission.slug}
                                                </span>
                                            ))
                                        )}
                                    </div>
                                    <p className="muted-text">
                                        {role.users_count ?? 0} user
                                        {(role.users_count ?? 0) === 1 ? "" : "s"}
                                    </p>
                                </div>
                                <div className="document-actions">
                                    <Button
                                        onClick={() => openPermissionModal(role)}
                                    >
                                        Manage Permissions
                                    </Button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            <Modal
                open={showCreateModal}
                title="Create Role"
                onClose={closeModals}
                size="lg"
            >
                <form className="modal-form" onSubmit={handleCreateRole}>
                    <ErrorMessage message={formError} />

                    <Input
                        label="Name"
                        name="name"
                        value={roleForm.name}
                        onChange={handleRoleFormChange}
                        placeholder="Editor"
                        required
                    />

                    <Input
                        label="Slug"
                        name="slug"
                        value={roleForm.slug}
                        onChange={handleRoleFormChange}
                        placeholder="editor (optional)"
                    />

                    <Input
                        label="Description"
                        name="description"
                        value={roleForm.description}
                        onChange={handleRoleFormChange}
                        placeholder="Can upload and download documents"
                    />

                    <div className="form-group">
                        <label>Permissions</label>
                        <div className="permission-groups">
                            {Object.entries(permissionGroups).map(
                                ([group, items]) => (
                                    <div key={group} className="permission-group">
                                        <h4>{group}</h4>
                                        {items.map((permission) => (
                                            <label
                                                key={permission.id}
                                                className="checkbox-row"
                                            >
                                                <input
                                                    type="checkbox"
                                                    checked={selectedPermissionIds.includes(
                                                        permission.id
                                                    )}
                                                    onChange={() =>
                                                        togglePermission(
                                                            permission.id
                                                        )
                                                    }
                                                />
                                                <span>
                                                    <strong>
                                                        {permission.name}
                                                    </strong>
                                                    <small>{permission.slug}</small>
                                                </span>
                                            </label>
                                        ))}
                                    </div>
                                )
                            )}
                        </div>
                    </div>

                    <div className="modal-actions">
                        <Button
                            type="button"
                            className="btn-secondary"
                            onClick={closeModals}
                            disabled={saving}
                        >
                            Cancel
                        </Button>
                        <Button type="submit" loading={saving}>
                            Create Role
                        </Button>
                    </div>
                </form>
            </Modal>

            <Modal
                open={showPermissionModal}
                title={`Permissions: ${selectedRole?.name || ""}`}
                onClose={closeModals}
                size="lg"
            >
                <form className="modal-form" onSubmit={handleSavePermissions}>
                    <ErrorMessage message={formError} />
                    <p className="muted-text">
                        Choose which actions this role can perform (CRUD, download,
                        user/role management).
                    </p>

                    <div className="permission-groups">
                        {Object.entries(permissionGroups).map(
                            ([group, items]) => (
                                <div key={group} className="permission-group">
                                    <h4>{group}</h4>
                                    {items.map((permission) => (
                                        <label
                                            key={permission.id}
                                            className="checkbox-row"
                                        >
                                            <input
                                                type="checkbox"
                                                checked={selectedPermissionIds.includes(
                                                    permission.id
                                                )}
                                                onChange={() =>
                                                    togglePermission(permission.id)
                                                }
                                            />
                                            <span>
                                                <strong>{permission.name}</strong>
                                                <small>
                                                    {permission.description ||
                                                        permission.slug}
                                                </small>
                                            </span>
                                        </label>
                                    ))}
                                </div>
                            )
                        )}
                    </div>

                    <div className="modal-actions">
                        <Button
                            type="button"
                            className="btn-secondary"
                            onClick={closeModals}
                            disabled={saving}
                        >
                            Cancel
                        </Button>
                        <Button type="submit" loading={saving}>
                            Save Permissions
                        </Button>
                    </div>
                </form>
            </Modal>
        </div>
    );
}
