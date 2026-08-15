import { Outlet, } from "react-router-dom";

import Navbar from "../components/layout/Navbar";
import Sidebar from "../components/layout/Sidebar";
export default function MainLayout() {
    return (
        <div className="app-layout">
            <Navbar />
            <div className="main-content">
                <Sidebar />
                <main className="page-content">
                    <Outlet />
                </main>
            </div>
        </div>
    );
}