import api from "./api";

const userService = {
    create: async (data) => {
        const response = await api.post(
            "/users",
            data
        );

        return response.data;
    },
};

export default userService;