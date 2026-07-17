import type { NextFunction, Request, Response } from "express";
import { getBlogList } from "../../services/blogs/blogServices.ts";

export const blogListController = async (
    req: Request,
    res: Response,
    next: NextFunction,
) => {
    try {
        const userId = (req as Request & { user?: { userId: string } }).user?.userId;
        const blogs = await getBlogList(userId);

        res.status(200).json({
            message: "Blog list fetched successfully",
            data: blogs,
        });
    } catch (error) {
        next(error);
    }
};
