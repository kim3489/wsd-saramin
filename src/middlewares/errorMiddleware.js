export const globalErrorHandler = (err, req, res) => {
    const statusCode = err.status || 500;

    const response = {
        status: 'error',
        message: err.message || 'Internal Server Error',
        code: err.code || 'INTERNAL_SERVER_ERROR',
    };

    res.status(statusCode).json(response);
};

export const notFoundHandler = (req, res) => {
    res.status(404).json({
        status: 'error',
        message: 'Resource not found',
        code: 'NOT_FOUND',
    });
};

export default globalErrorHandler