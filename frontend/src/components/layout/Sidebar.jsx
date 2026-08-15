import { NavLink } from "react-router-dom";
import useAuth from "../../hooks/useAuth";
export default function Sidebar() {
    const { isAdmin } = useAuth();
    return (
        <aside className="sidebar">
            <NavLink to="/">
                Dashboard
            </NavLink>
            <NavLink to="/documents">
                Documents
            </NavLink>
            {isAdmin && (
                <NavLink to="/users">
                    Users
                </NavLink>
            )}
        </aside>
    );
}