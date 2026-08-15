import api from "./api";

const documentService = {
    getAll: async (page = 1) => {
        const response = await api.get(
            "/documents",
            {
                params: {
                    page,
                },
            }
        );
        return response.data;
    },

    upload: async (formData) => {
        const response = await api.post(
            "/documents",
            formData,
            {
                headers: {
                    "Content-Type":
                        "multipart/form-data",
                },
            }
        );

        return response.data;
    },

    delete: async (id) => {
        const response = await api.delete(
            `/documents/${id}`
        );

        return response.data;
    },

    download: async (id) => {
        const response = await api.get(
            `/documents/${id}/download`,
            {
                responseType: "blob",
            }
        );

        return response;
    },
}

export default documentService;