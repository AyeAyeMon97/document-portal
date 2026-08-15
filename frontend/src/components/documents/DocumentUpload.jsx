import { useState } from "react";

import Input from "../common/Input";
import Button from "../common/Button";
import ErrorMessage from "../common/ErrorMessage";

import documentController from "../../controllers/documentController";

import {
    getErrorMessage,
} from "../../utils/errorHandler";

export default function DocumentUpload({
    onUploaded,
}) {
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
        } catch (error) {
            setError(getErrorMessage(error));
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="card">
            <h2>  Upload Document  </h2>
            <form onSubmit={handleSubmit} >
                <Input
                    label="Title"
                    value={title}
                    onChange={(e) =>
                        setTitle(
                            e.target.value
                        )
                    }
                    placeholder="Document title"
                    required
                />

                <div className="form-group">
                    <label>  File </label>

                    <input
                        type="file"
                        onChange={(e) =>
                            setFile(
                                e.target.files?.[0] ||
                                null
                            )
                        }
                        required
                    />

                </div>

                <ErrorMessage message={error} />

                <Button type="submit" loading={loading} >
                    Upload
                </Button>
            </form>
        </div>
    );
}