import Button from "../common/Button";
import useAuth from "../../hooks/useAuth";

export default function DocumentItem({
    document,
    onDelete,
    onDownload,
    onEdit,
}) {
    const { user } = useAuth();
    const isOwner = document.uploaded_by?.id === user?.id;

    return (
        <div className="document-item">
            <div className="document-item-info">
                <h3>{document.title}</h3>
                <div className="document-meta">
                    <span>{document.file_name}</span>
                    <span>{document.mime_type}</span>
                    <span>By {document.uploaded_by?.name || "Unknown"}</span>
                </div>
            </div>

            <div className="document-actions">
                <Button
                    className="btn-secondary"
                    onClick={() => onDownload(document)}
                >
                    Download
                </Button>

                {isOwner && (
                    <>
                        <Button onClick={() => onEdit(document)}>Edit</Button>
                        <Button
                            onClick={() => onDelete(document.id)}
                            className="danger"
                        >
                            Delete
                        </Button>
                    </>
                )}
            </div>
        </div>
    );
}
