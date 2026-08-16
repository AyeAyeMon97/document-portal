import { useEffect, useState } from "react";

import Button from "../common/Button";
import ErrorMessage from "../common/ErrorMessage";

import documentController from "../../controllers/documentController";
import { getErrorMessage } from "../../utils/errorHandler";

export default function DocumentEdit({
    document,
    onUpdated,
    onCancel,
}) {
    const [title, setTitle] = useState("");
    const [file, setFile] = useState(null);

    const [loading, setLoading] = useState(false);

    const [error, setError] = useState("");

    useEffect(() => {
        if (document) {
            setTitle(document.title || "");
            setFile(null);
        }
    }, [document]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            setLoading(true);
            setError("");

            await documentController.update(
                document.id,
                title,
                file
            );

            onUpdated();

        } catch (error) {
            setError(
                getErrorMessage(error)
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="card">
            <h2> Edit Document </h2>

            <ErrorMessage message={error} />

            <form onSubmit={handleSubmit} >
                <div>
                    <label> Title </label>

                    <input type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        required
                    />
                </div>

                <div>
                    <label>   Current File </label>

                    <p> {document.file_name} </p>
                </div>

                <div>
                    <label> New File {" "}
                        <small>(optional) </small>
                    </label>

                    <input type="file"
                        onChange={(e) => setFile(e.target.files[0] || null)}
                    />
                </div>

                <div className="document-actions">
                    <Button type="submit" disabled={loading} >
                        {loading ? "Updating..." : "Update"}
                    </Button>

                    <Button type="button"
                        onClick={onCancel}
                        disabled={loading}
                    >
                        Cancel
                    </Button>

                </div>
            </form>
        </div>
    );
}