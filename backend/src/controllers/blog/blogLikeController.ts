import type { NextFunction, Request, Response } from "express";
import { likeBlogService } from "../../services/blogs/blogServices.ts";

export const blogLikeController = async (req: Request, res: Response, next: NextFunction) => {
    const userId = (req as Request & { user?: { userId: string } })?.user?.userId

    if (!userId) {
        res.status(401).json({ message: "Unauthorized" })
        return
    }

    const { blogId } = req.body

    if (!blogId || typeof blogId !== "string") {
        res.status(400).json({ message: "Blog ID is required" })
        return
    }

    try {
        const result = await likeBlogService(blogId, userId)
        res.status(200).json({
            liked: result.liked,
            likeCount: result.likeCount
        })
    } catch (error) {
        next(error)
        return
    }
}
