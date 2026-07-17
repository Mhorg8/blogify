import jwt from "jsonwebtoken";
import type { SignOptions } from "jsonwebtoken";

export const generateAccessToken = (userId: string): string => {
    const secret = process.env.JWT_ACCESS_SECRET;
    const expiresIn = (process.env.ACCESS_TOKEN_EXPIRE ?? "15m") as SignOptions["expiresIn"];

    if (!secret) {
        throw new Error("JWT_ACCESS_SECRET is not configured");
    }

    return jwt.sign({ userId }, secret, { expiresIn });
};

export const generateRefreshToken = (userId: string): string => {
    const secret = process.env.JWT_REFRESH_SECRET;
    const expiresIn = (
        process.env.REFRESH_TOKEN_EXPIRE ??
        process.env.REFESH_TOKEN_EXPIRE ??
        "7d"
    ) as SignOptions["expiresIn"];

    if (!secret) {
        throw new Error("JWT_REFRESH_SECRET is not configured");
    }

    return jwt.sign({ userId }, secret, { expiresIn });
};
