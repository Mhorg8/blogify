import {prisma} from "../../config/db.ts";
import {AppError} from "../../errors/AppError.ts";

export const getUserList = async () => {
    try {
        const users = await prisma.user.findMany()
        return users
    } catch (error) {
        throw new AppError(500, "Error while retrieving users")
    }
}