export default function Button({
    children,
    type = "button",
    onClick,
    disabled = false,
    loading = false,
    className = "",
}) {
    return (
        <button
            type={type}
            onClick={onClick}
            disabled={disabled || loading}
            className={`btn ${className}`}>
            {loading ? "Loading..." : children}
        </button>);
}