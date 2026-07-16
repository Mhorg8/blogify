import type { Response } from "express";

export const logoutController = async (res: Response): Promise<void> => {
    res.clearCookie("accessToken", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production" ? true : false,
        sameSite: "strict",
    });

    res.status(200).json({
        message: "Logged out successfully",
    })
}