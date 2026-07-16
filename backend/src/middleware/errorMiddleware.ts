import type { ErrorRequestHandler } from "express";

type ErrorWithStatus = Error & { status?: number; statusCode?: number };

export const errorMiddleware: ErrorRequestHandler = (
    error,
    _req,
    res,
    _next,
) => {
    console.error(error);
    const knownError = error as ErrorWithStatus;
    const statusCode = knownError.statusCode ?? knownError.status ?? 500;
    const message = statusCode >= 500 ? "Internal server error" : knownError.message;

    res.status(statusCode).json({
        message,
    });
};