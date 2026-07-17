import { prisma } from "../../config/db.ts"
import { AppError } from "../../errors/AppError.ts"

export const likeBlogService = async (blogId: string, userId: string) => {
    const blog = await prisma.blog.findUnique({
        where: { id: blogId }
    })

    if (!blog) {
        throw new AppError(404, "Blog not found")
    }

    const existing = await prisma.blogLike.findFirst({
        where: { blogId, userId },
    })

    // already liked → unlike
    if (existing) {
        const [, updated] = await prisma.$transaction([
            prisma.blogLike.delete({
                where: { id: existing.id }
            }),
            prisma.blog.update({
                where: { id: blogId },
                data: { like_count: { decrement: 1 } },
                select: { like_count: true }
            })
        ])
        return {
            liked: false,
            likeCount: updated.like_count
        }
    }

    const [, updated] = await prisma.$transaction([
        prisma.blogLike.create({
            data: { blogId, userId }
        }),
        prisma.blog.update({
            where: { id: blogId },
            data: { like_count: { increment: 1 } },
            select: { like_count: true }
        })
    ])

    return {
        liked: true,
        likeCount: updated.like_count
    }
}
