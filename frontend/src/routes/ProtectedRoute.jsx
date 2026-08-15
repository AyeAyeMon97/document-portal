import { Navigate, Outlet } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import Loading from "../components/common/Loading";

export default function ProtectedRoute() {
    const { isAuthenticated, loading, } = useAuth();
    if (loading) {
        return (
            <Loading text="Checking authentication..." />
        );
    }

    if (!isAuthenticated) {
        return (
            <Navigate to="/login" replace />
        );
    }

    return <Outlet />;
}