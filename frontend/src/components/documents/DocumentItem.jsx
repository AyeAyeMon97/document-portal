import Button from "../common/Button";
import useAuth from "../../hooks/useAuth";

export default function DocumentItem({
    document,
    onDelete,
    onDownload,
}) {
    const { user } = useAuth();

    const isOwner = document.uploaded_by?.id === user?.id;

    return (
        <div className="document-item">
            <div>
                <h3> {document.title} </h3>
                <p>  File:   {" "} {document.file_name}</p>
                <p> Uploaded by: {" "} {document.uploaded_by?.name} </p>
                <p>  Type: {" "} {document.mime_type}</p>
            </div>

            <div className="document-actions">
                <Button onClick={() => onDownload(document)}  >
                    Download
                </Button>

                {isOwner && (
                    <Button onClick={() => onDelete(document.id)} className="danger">
                        Delete
                    </Button>
                )}

            </div>

        </div>
    );
}