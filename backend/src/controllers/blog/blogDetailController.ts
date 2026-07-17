import type { NextFunction, Request, Response } from "express";
import { getBlogDetailBySlug } from "../../services/blogs/blogServices.ts";
import { AppError } from "../../errors/AppError.ts";

export const getBlogDetailController = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { slug } = req.params
        const blog = await getBlogDetailBySlug(slug as string)

        if (!blog) {
            throw new AppError(500, "Blog not found")
        }

        res.status(200).json({
            success: true,
            message: "Blog fetched successfully",
            data: blog
        })
    } catch (error) {
        next(error)
    }
}