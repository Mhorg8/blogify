import type { NextFunction, Request, Response } from "express";
import { registerSchema } from "../validators/authValidator.ts";
import { createUser } from "../services/authService.ts";
export const register = async (req: Request, res: Response, next: NextFunction) => {
    const result = registerSchema.safeParse(req.body);


    if (!result.success) {
        res.status(400).json({
            message: 'Validation failed',
            errors: result.error.issues.map((issue) => issue.message),
        })
        return;
    }

    try {
        const user = await createUser(result.data);
        if (!user) {
            res.status(409).json({
                message: 'User already exists',
            })
            return;
        }

        res.status(201).json({
            message: 'User registered successfully',
            data: user,
        })
        return;
    } catch (error) {
        next(error)
    }
}