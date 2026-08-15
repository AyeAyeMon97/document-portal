export const getErrorMessage = (error) => {
    if (error.response?.data?.message) {
        return error.response.data.message;
    }

    if (error.response?.data?.errors) {
        const errors = error.response.data.errors;

        const firstError = Object.values(errors)[0];

        if (Array.isArray(firstError)) {
            return firstError[0];
        }
    }

    if (error.message) {
        return error.message;
    }

    return "Something went wrong.";
}