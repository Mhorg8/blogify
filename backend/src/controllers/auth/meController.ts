import type { NextFunction, Request, Response } from "express";
import { getProfile } from "../../services/meService.ts";

export const meController = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const userId = (req as Request & { user?: { userId: string } }).user?.userId;

        if (!userId) {
            res.status(401).json({ message: "Unauthorized" });
            return;
        }

        const user = await getProfile(userId);


        if (!user) {
            res.status(401).json({ message: "Unauthorized" });
            return;
        }


        res.status(200).json({
            message: "User fetched successfully",
            user,
        });
    } catch (error) {
        next(error);
        return;
    }
}