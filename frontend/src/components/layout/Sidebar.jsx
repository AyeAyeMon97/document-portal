import { NavLink } from "react-router-dom";
import useAuth from "../../hooks/useAuth";

export default function Sidebar() {
    const { isAdmin, hasPermission } = useAuth();

    const canViewUsers = isAdmin || hasPermission("users.view");
    const canViewRoles = isAdmin || hasPermission("roles.view");

    return (
        <aside className="sidebar">
            <NavLink to="/">Dashboard</NavLink>
            <NavLink to="/documents">Documents</NavLink>
            {canViewUsers && <NavLink to="/users">Users</NavLink>}
            {canViewRoles && <NavLink to="/roles">Roles</NavLink>}
        </aside>
    );
}
