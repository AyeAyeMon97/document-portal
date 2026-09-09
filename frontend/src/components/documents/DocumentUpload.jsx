import { useState } from "react";

import Input from "../common/Input";
import Button from "../common/Button";
import ErrorMessage from "../common/ErrorMessage";

import documentController from "../../controllers/documentController";
import { getErrorMessage } from "../../utils/errorHandler";

export default function DocumentUpload({ onUploaded, onCancel }) {
    const [title, setTitle] = useState("");
    const [file, setFile] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");

        if (!file) {
            setError("Please select a file.");
            return;
        }

        try {
            setLoading(true);
            await documentController.upload(title, file);
            setTitle("");
            setFile(null);
            e.target.reset();

            if (onUploaded) {
                await onUploaded();
            }
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
                name="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Document title"
                required
            />

            <div className="form-group">
                <label htmlFor="document-file">File</label>
                <input
                    id="document-file"
                    type="file"
                    className="file-input"
                    onChange={(e) => setFile(e.target.files?.[0] || null)}
                    required
                />
            </div>

            <ErrorMessage message={error} />

            <div className="modal-actions">
                {onCancel && (
                    <Button
                        type="button"
                        className="btn-secondary"
                        onClick={onCancel}
                        disabled={loading}
                    >
                        Cancel
                    </Button>
                )}
                <Button type="submit" loading={loading}>
                    Upload
                </Button>
            </div>
        </form>
    );
}
