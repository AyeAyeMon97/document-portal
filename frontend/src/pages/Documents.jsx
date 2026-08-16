import {
    useCallback,
    useEffect,
    useState,
} from "react";

import DocumentUpload from "../components/documents/DocumentUpload";
import DocumentList from "../components/documents/DocumentList";
import DocumentEdit from "../components/documents/DocumentEdit";
import Button from "../components/common/Button";
import ErrorMessage from "../components/common/ErrorMessage";

import documentController from "../controllers/documentController";

import { getErrorMessage, } from "../utils/errorHandler";

export default function Documents() {
    const [documents, setDocuments] = useState([]);
    const [editingDocument, setEditingDocument] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [page, setPage] = useState(1);
    const [lastPage, setLastPage] = useState(1);

    const loadDocuments = useCallback(
        async (currentPage = 1) => {
            try {
                setLoading(true);
                setError("");

                const response = await documentController.getDocuments(
                    currentPage
                );

                setDocuments(response.data || []);

                setPage(response.meta?.current_page || currentPage);

                setLastPage(response.meta?.last_page || 1);
            } catch (error) {
                setError(getErrorMessage(error));
            } finally {
                setLoading(false);
            }
        }, []);

    useEffect(() => {
        loadDocuments(1);
    }, [loadDocuments]);

    const handleDelete = async (id) => {
        const confirmed = window.confirm(
            "Are you sure you want to delete this document?"
        );

        if (!confirmed) {
            return;
        }

        try {
            setError("");

            await documentController.delete(id);

            await loadDocuments(page);
        } catch (error) {
            setError(getErrorMessage(error));
        }
    };

    const handleEdit = (document) => {
        setError("");
        setEditingDocument(document);
    };

    const handleUpdated = async () => {
        setEditingDocument(null);
        await loadDocuments(page);
    };

    const handleCancelEdit = () => {
        setEditingDocument(null);
    };

    const handleDownload = async (document) => {
        try {
            setError("");
            await documentController.download(document);
        } catch (error) {
            setError(getErrorMessage(error));
        }
    };

    const handlePrevious = () => {
        if (page > 1) {
            loadDocuments(
                page - 1
            );
        }
    };

    const handleNext = () => {
        if (page < lastPage) {
            loadDocuments(
                page + 1
            );
        }
    };

    return (
        <div>
            <div className="page-header">
                <div>
                    <h1> Documents</h1>
                    <p>
                        All internal company
                        documents
                    </p>
                </div>

            </div>

            <ErrorMessage message={error} />

            {/* <DocumentUpload onUploaded={() => loadDocuments(1)} /> */}
            {editingDocument ? (
                <DocumentEdit
                    document={editingDocument}
                    onUpdated={handleUpdated}
                    onCancel={handleCancelEdit}
                />
            ) : (
                <DocumentUpload onUploaded={() => loadDocuments(1)} />
            )}

            <div className="card">
                <h2> All Documents  </h2>
                <DocumentList
                    documents={documents}
                    loading={loading}
                    onDelete={handleDelete}
                    onDownload={handleDownload}
                    onEdit={handleEdit}
                />

                {!loading &&
                    documents.length >
                    0 && (
                        <div className="pagination">

                            <Button onClick={handlePrevious} disabled={page <= 1} >
                                Previous
                            </Button>

                            <span>
                                Page{" "}
                                {page}{" "}
                                of{" "}
                                {lastPage}
                            </span>

                            <Button onClick={handleNext} disabled={page >= lastPage} >
                                Next
                            </Button>
                        </div>
                    )}
            </div>
        </div>
    );
}