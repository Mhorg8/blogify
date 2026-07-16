import type { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";


type JwtPayload = { userId: string }

export const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
    const accessToken = req.cookies?.accessToken;

    if (!accessToken) {
        res.status(401).json({
            message: 'Unauthorized',
        })
        return;
    }


    const secret = process.env.JWT_ACCESS_SECRET;
    if (!secret) {
        next(new Error('JWT_ACCESS_SECRET is not configured'));
        return
    }


    try {
        const decoded = jwt.verify(accessToken, secret) as JwtPayload

        (req as Request & { user?: JwtPayload }).user = {
            userId: decoded.userId,
        }

        next();
    } catch (error) {
        res.status(401).json({ message: "Unauthorized" });
        return;
    }
}