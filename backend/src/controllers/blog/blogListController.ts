import type { NextFunction, Request, Response } from "express";
import { getBlogList } from "../../services/blogs/blogListService.ts";

export const blogListController = async (
    _req: Request,
    res: Response,
    next: NextFunction,
) => {
    try {
        const blogs = await getBlogList()
        res.status(200).json({
            message: "Blog list fetched successfully",
            data: blogs
        })
    } catch (error) {
        next(error)
    }
}