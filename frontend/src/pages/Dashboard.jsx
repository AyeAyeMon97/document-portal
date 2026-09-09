import useAuth from "../hooks/useAuth";

export default function Dashboard() {
    const { user } = useAuth();

    return (
        <div>
            <div className="page-header">
                <h1>Dashboard</h1>
                <p>Overview of your document portal account</p>
            </div>

            <div className="card">
                <div className="card-header">
                    <h2>Welcome, {user?.name}</h2>
                </div>
                <div className="document-meta">
                    <span>Email: {user?.email}</span>
                    <span>Role: {user?.role}</span>
                </div>
            </div>
        </div>
    );
}
