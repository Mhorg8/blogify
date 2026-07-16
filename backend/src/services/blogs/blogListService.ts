import { prisma } from "../../config/db.ts"

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
        throw new Error("Failed to get blog list", { cause: error })
    }
}