import { prisma } from "../../config/db.ts"
import { AppError } from "../../errors/AppError.ts"

export const getBlogList = async () => {
    try {
        const blogs = await prisma.blog.findMany({
            include: {
                author: {
                    select: {
                        name: true,
                        email: true,
                    },
                },
            },
        });

        return blogs.map(({ author, ...blog }) => ({
            ...blog,
            author: author.name,
            authorEmail: author.email,
        }));

    } catch (error) {
        throw new AppError(500, "Failed to get blog list")
    }
}