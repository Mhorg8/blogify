import type { NextFunction, Request, Response } from "express";
import { likeBlogService } from "../../services/blogs/likeBlogService.ts";

export const blogLikeController = async (req: Request, res: Response, next: NextFunction) => {
    const userId = (req as Request & { user?: { userId: string } })?.user?.userId

    if (!userId) {
        res.status(401).json({ message: "Unauthorized" })
        return
    }

    const { blogId } = req.body

    if (!blogId) {
        res.status(400).json({ message: "Blog ID is required" })
        return
    }

    try {
        await likeBlogService(blogId)
    } catch (error) {
        next(error)
        return
    }

    res.status(200).json({ message: "Blog liked successfully" })
}