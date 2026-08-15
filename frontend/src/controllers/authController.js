import authService from "../services/authService";
import {
    setToken,
    removeToken,
} from "../utils/storage";

const authController = {
    login: async (credentials) => {
        const response = await authService.login(credentials);

        const token = response.data?.token;

        const user = response.data?.user;
        if (!token) {
            throw new Error(
                "Authentication token was not returned."
            );
        }
        setToken(token);
        return user;
    },

    logout: async () => {
        try {
            await authService.logout();
        } finally {
            removeToken();
        }
    },

    getCurrentUser: async () => {
        const response = await authService.me();
        return response.data;
    }
}

export default authController;