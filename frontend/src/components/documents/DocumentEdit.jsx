import { useEffect, useState } from "react";

import Input from "../common/Input";
import Button from "../common/Button";
import ErrorMessage from "../common/ErrorMessage";

import documentController from "../../controllers/documentController";
import { getErrorMessage } from "../../utils/errorHandler";

export default function DocumentEdit({ document, onUpdated, onCancel }) {
    const [title, setTitle] = useState("");
    const [file, setFile] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    useEffect(() => {
        if (document) {
            setTitle(document.title || "");
            setFile(null);
            setError("");
        }
    }, [document]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            setLoading(true);
            setError("");

            await documentController.update(document.id, title, file);
            onUpdated();
        } catch (err) {
            setError(getErrorMessage(err));
        } finally {
            setLoading(false);
        }
    };

    return (
        <form className="modal-form" onSubmit={handleSubmit}>
            <Input
                label="Title"
                name="edit-title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
            />

            <div className="form-group">
                <label>Current File</label>
                <p className="file-meta">{document.file_name}</p>
            </div>

            <div className="form-group">
                <label htmlFor="edit-file">
                    New File <span className="optional-label">(optional)</span>
                </label>
                <input
                    id="edit-file"
                    type="file"
                    className="file-input"
                    onChange={(e) => setFile(e.target.files?.[0] || null)}
                />
            </div>

            <ErrorMessage message={error} />

            <div className="modal-actions">
                <Button
                    type="button"
                    className="btn-secondary"
                    onClick={onCancel}
                    disabled={loading}
                >
                    Cancel
                </Button>
                <Button type="submit" loading={loading}>
                    Update
                </Button>
            </div>
        </form>
    );
}
