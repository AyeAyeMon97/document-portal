import api from "./api";

const userService = {
    getAll: async () => {
        const response = await api.get("/users");
        return response.data;
    },

    create: async (data) => {
        const response = await api.post("/users", data);
        return response.data;
    },
};

export default userService;
