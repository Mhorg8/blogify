import { prisma } from "../../config/db.ts";
import { createHash } from "node:crypto";
import { generateAccessToken, generateRefreshToken } from "../../utils/generateToken.ts";
import { verifyPassword } from "../../utils/verifyPassword.ts";
import type { loginInput } from "../../validators/loginValidator.ts";

type LoginResult = {
    accessToken: string;
    refreshToken: string;
    user: {
        id: string;
        name: string;
        email: string;
    };
};

const parseDurationToMs = (duration: string): number => {
    const matched = /^(\d+)([mhd])$/i.exec(duration);

    if (!matched) {
        return 7 * 24 * 60 * 60 * 1000;
    }

    const value = Number(matched[1]);
    const unit = matched[2].toLowerCase();

    if (unit === "m") return value * 60 * 1000;
    if (unit === "h") return value * 60 * 60 * 1000;
    return value * 24 * 60 * 60 * 1000;
};

export const loginUser = async (data: loginInput): Promise<LoginResult | null> => {
    const existingUser = await prisma.user.findUnique({
        where: {
            email: data.email,
        },
    });

    if (!existingUser) {
        return null;
    }

    const isPasswordValid = await verifyPassword(data.password, existingUser.password);

    if (!isPasswordValid) {
        return null;
    }

    const accessToken = generateAccessToken(existingUser.id);
    const refreshToken = generateRefreshToken(existingUser.id);
    const refreshTokenHash = createHash("sha256").update(refreshToken).digest("hex");
    const refreshTokenDuration = process.env.REFRESH_TOKEN_EXPIRE ?? process.env.REFESH_TOKEN_EXPIRE ?? "7d";
    const expiresAt = new Date(Date.now() + parseDurationToMs(refreshTokenDuration));

    await prisma.refreshToken.create({
        data: {
            tokenHash: refreshTokenHash,
            expiresAt,
            userId: existingUser.id,
        },
    });

    return {
        accessToken,
        refreshToken,
        user: {
            id: existingUser.id,
            name: existingUser.name,
            email: existingUser.email,
        },
    };
};