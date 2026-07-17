import type { NextFunction, Request, Response } from "express";
import type { ParamsDictionary } from "express-serve-static-core";
import { createBlogSchema, type CreateBlogRequest } from "../../validators/createBlogValidator.ts";
import { createBlogService } from "../../services/blogs/blogServices.ts";

export const blogCreateController = async (
    req: Request<ParamsDictionary, any, CreateBlogRequest>,
    res: Response,
    next: NextFunction,
) => {
    const userId = (req as Request & { user?: { userId: string } }).user?.userId;
    if (!userId) {
        res.status(401).json({
            message: "Unauthorized"
        })

        return
    }

    const validationResult = createBlogSchema.safeParse(req.body);

    if (!validationResult.success) {
        res.status(400).json({
            message: "Validation failed",
            errors: validationResult.error.issues.map((issue) => issue.message),
        });
        return;
    }

    try {
        const blog = await createBlogService(validationResult.data, userId);

        res.status(201).json({
            message: "Blog created successfully",
            data: blog,
        });
        return;
    } catch (error) {
        next(error);
        return;
    }
};
