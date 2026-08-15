import DocumentItem from "./DocumentItem";
import Loading from "../common/Loading";

export default function DocumentList({
    documents,
    loading,
    onDelete,
    onDownload,
}) {
    if (loading) {
        return (
            <Loading text="Loading documents..." />
        );
    }

    if (!documents.length) {
        return (
            <div className="empty-state">
                No documents found.
            </div>
        );
    }

    return (
        <div className="document-list">
            {documents.map(
                (document) => (
                    <DocumentItem
                        key={document.id}
                        document={document}
                        onDelete={
                            onDelete
                        }
                        onDownload={
                            onDownload
                        }
                    />
                )
            )}

        </div>
    );
}