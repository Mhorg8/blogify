import { prisma } from "../../config/db.ts";
import { hashPassword } from "../../utils/password.ts";
import type { RegisterInput } from "../../validators/authValidator.ts";

export const createUser = async (data: RegisterInput) => {

    const existingUser = await prisma.user.findUnique({
        where: {
            email: data.email
        }
    })

    if (existingUser) {
        throw new Error("User already exists")
    }

    const hashedPassword = await hashPassword(data.password)


    return await prisma.user.create({
        data: {
            ...data,
            password: hashedPassword
        }, select: {
            id: true,
            name: true,
            email: true,
            createdAt: true,
            updatedAt: true,
            refreshTokens: true,
        }
    })
}