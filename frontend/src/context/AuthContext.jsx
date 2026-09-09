import {
    createContext,
    useEffect,
    useState,
} from "react";

import authController from "../controllers/authController";
import {
    getToken,
    removeToken,
} from "../utils/storage";

export const AuthContext = createContext(null);
export function AuthProvider({
    children,
}) {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    useEffect(() => {
        const loadUser = async () => {
            const token = getToken();
            if (!token) {
                setLoading(false);
                return;
            }

            try {
                const currentUser = await authController.getCurrentUser();
                setUser(currentUser);
            } catch (error) {
                removeToken();
                setUser(null);
            } finally {
                setLoading(false);
            }
        };
        loadUser();
    }, []);

    useEffect(() => {
        const handleUnauthorized = () => {
            removeToken();
            setUser(null);
        };
        window.addEventListener(
            "unauthorized",
            handleUnauthorized
        );
        return () => {
            window.removeEventListener(
                "unauthorized",
                handleUnauthorized
            );
        };
    }, []);

    const login = (userData) => {
        setUser(userData);
    };

    const logout = async () => {
        try {
            await authController.logout();
        } catch (error) {
            removeToken();
        }
        setUser(null);
    };

    const value = {
        user,
        loading,
        login,
        logout,
        isAuthenticated: Boolean(user),
        isAdmin: user?.role === "admin",
        hasPermission: (permission) =>
            Boolean(user?.permissions?.includes(permission)),
    };
    return (
        <AuthContext.Provider value={value} >
            {children}
        </AuthContext.Provider>
    );
}