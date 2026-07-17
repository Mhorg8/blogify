import { prisma } from "../../config/db.ts"
import { AppError } from "../../errors/AppError.ts"

export const likeBlogService = async (blogId: string) => {
    const blog = await prisma.blog.findUnique({
        where: {
            id: blogId
        }
    })

    if (!blog) {
        throw new AppError(404, "Blog not found")
    }

    try {
        return await prisma.blog.update({
            where: { id: blogId },
            data: { like_count: { increment: 1 } },
            select: { id: true, like_count: true }
        })
    } catch (error) {
        throw new AppError(404, "Blog not found")
    }
}