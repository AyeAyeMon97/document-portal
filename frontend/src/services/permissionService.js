import api from "./api";

const permissionService = {
    getAll: async () => {
        const response = await api.get("/permissions");
        return response.data;
    },
};

export default permissionService;
