import { prisma } from "../config/db.ts"

export const getProfile = async (userId: string) => {
    return await prisma.user.findUnique({
        where: {
            id: userId
        }, select: {
            id: true,
            name: true,
            email: true,
            createdAt: true,
            updatedAt: true,
        }
    })
}