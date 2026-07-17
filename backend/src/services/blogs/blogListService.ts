import { prisma } from "../../config/db.ts"
import { AppError } from "../../errors/AppError.ts"

export const getBlogList = async (userId?: string) => {
    try {
        const blogs = await prisma.blog.findMany({
            include: {
                author: {
                    select: {
                        name: true,
                        email: true,
                    },
                },
                blogLikes: userId
                    ? { where: { userId }, select: { id: true } }
                    : false,
            },
        });

        return blogs.map(({ author, blogLikes, ...blog }) => ({
            ...blog,
            author: author.name,
            authorEmail: author.email,
            liked: Array.isArray(blogLikes) ? blogLikes.length > 0 : false,
        }));
    } catch (error) {
        throw new AppError(500, "Failed to get blog list")
    }
}
