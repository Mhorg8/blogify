import type {NextFunction, Request, Response} from "express";
import {AppError} from "../../errors/AppError.ts";
import {getUserList} from "../../services/users/usersServices.ts";

export const getUserController = async (req: Request, res: Response, next: NextFunction) => {
   const users = await  getUserList()
    try {
        return res.status(200).json(users)
    }catch (error) {
       throw new AppError(500, "Error while retrieving users")
    }
}