import useAuth from "../../hooks/useAuth";
export default function Navbar() {
    const { user, logout, } = useAuth();
    return (
        <header className="navbar">
            <div>
                <strong> Document Portal</strong>
            </div>
            <div className="navbar-user">
                <span> {user?.name}</span>
                <span> ({user?.role}) </span>
                <button onClick={logout} className="logout-button">
                    Logout
                </button>
            </div>
        </header>
    );
}