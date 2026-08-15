import {
    BrowserRouter,
    Routes,
    Route,
} from "react-router-dom";

import Login from "../pages/Login";
import Dashboard from "../pages/Dashboard";
import Documents from "../pages/Documents";
import Users from "../pages/Users";
import NotFound from "../pages/NotFound";

import MainLayout from "../layouts/MainLayout";

import ProtectedRoute from "./ProtectedRoute";
import AdminRoute from "./AdminRoute"
export default function AppRoutes() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/login" element={<Login />} />

                <Route element={<ProtectedRoute />}>
                    <Route element={<MainLayout />} >
                        <Route path="/" element={<Dashboard />} />
                        <Route path="/documents" element={<Documents />} />

                        <Route element={<AdminRoute />} >
                            <Route path="/users" element={<Users />}
                            />
                        </Route>
                    </Route>
                </Route>
                <Route path="*" element={<NotFound />} />
            </Routes>
        </BrowserRouter>
    );
}