import { loginUser } from "../../services/authentication/loginService.ts";
import { loginSchema } from "../../validators/loginValidator.ts";
import type { NextFunction, Request, Response } from "express";

export const loginController = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const result = loginSchema.safeParse(req.body);

    if (!result.success) {
        res.status(400).json({
            message: "Validation failed",
            errors: result.error.issues.map((issue) => issue.message),
        });
        return;
    }

    try {
        const data = await loginUser(result.data);

        if (!data) {
            res.status(401).json({
                message: "Invalid email or password",
            });
            return;
        }

        const isProduction = process.env.NODE_ENV === "production";

        res.cookie("accessToken", data.accessToken, {
            httpOnly: true,
            secure: isProduction,
            sameSite: "lax",
            maxAge: 15 * 60 * 1000,
        });

        res.cookie("refreshToken", data.refreshToken, {
            httpOnly: true,
            secure: isProduction,
            sameSite: "lax",
            maxAge: 7 * 24 * 60 * 60 * 1000,
        });

        res.status(200).json({
            message: "Login successful",
            user: data.user,
        });
        return;
    } catch (error) {
        next(error);
    }
};