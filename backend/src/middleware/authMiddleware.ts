import type { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";

type JwtPayload = { userId: string }
type RequestWithUser = Request & { user?: JwtPayload }

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
        const userId = String(decoded.userId)

        if (!userId || userId === "NaN" || userId === "undefined") {
            res.status(401).json({ message: "Unauthorized" });
            return;
        }

        (req as RequestWithUser).user = { userId }
        next();
    } catch (error) {
        res.status(401).json({ message: "Unauthorized" });
        return;
    }
}

/** Attaches req.user when a valid token exists; never blocks the request. */
export const optionalAuthMiddleware = (req: Request, _res: Response, next: NextFunction) => {
    const accessToken = req.cookies?.accessToken;
    if (!accessToken) {
        next();
        return;
    }

    const secret = process.env.JWT_ACCESS_SECRET;
    if (!secret) {
        next();
        return;
    }

    try {
        const decoded = jwt.verify(accessToken, secret) as JwtPayload;
        const userId = String(decoded.userId)
        if (userId && userId !== "NaN" && userId !== "undefined") {
            (req as RequestWithUser).user = { userId };
        }
    } catch {
        // invalid/expired token → treat as guest
    }

    next();
}
