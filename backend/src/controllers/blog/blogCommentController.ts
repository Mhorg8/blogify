import type { NextFunction, Request, Response } from "express";
import { AppError } from "../../errors/AppError.ts";
import { createCommentSchema } from "../../validators/createCommentValidator.ts";
import { createCommentService } from "../../services/blogs/blogServices.ts";


export type CommentResponseDto = {
    id: string;
    content: string;
    blogId: string;
    createdAt: Date;
    author: { name: string; email: string };
};

export const blogCommentController = async (req: Request, res: Response, next: NextFunction) => {
    const userId = (req as Request & { user: { userId: string } })?.user?.userId
    if (!userId) {
        throw new AppError(401, "Unauthorized")
    }


    const validateRequest = createCommentSchema.safeParse(req.body)

    if (!validateRequest.success) {
        res.status(400).json({
            message: "Validation failed",
            errors: validateRequest.error.issues.map((issue) => issue.message),
        });
        return;
    }

    try {
        const comment = await createCommentService(validateRequest.data, userId)
        res.status(200).json({
            message: "Comment created successfully",
            data: {
                ...comment,
                author: {
                    name: comment.author.name,
                    email: comment.author.email,
                }
            },
        });
        return;
    } catch (error) {
        next(error);
    }
}