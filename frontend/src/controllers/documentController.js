import documentService from "../services/documentService";

const documentController = {
    getDocuments: async (page = 1) => {
        return await documentService.getAll(
            page
        );
    },

    upload: async (title, file) => {
        const formData = new FormData();

        formData.append("title", title);
        formData.append("file", file);

        return await documentService.upload(
            formData
        );
    },

    delete: async (id) => {
        return await documentService.delete(
            id
        );
    },

    download: async (documentData) => {
        const response = await documentService.download(
            documentData.id
        );
        const url = window.URL.createObjectURL(
            new Blob([response.data])
        );
        const link = window.document.createElement("a");

        link.href = url;
        link.download = documentData.file_name || "document";
        window.document.body.appendChild(
            link
        );
        link.click();
        link.remove();
        window.URL.revokeObjectURL(url);
    },
};

export default documentController;