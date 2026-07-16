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

        await prisma.blog.updateMany({
            data: {
                view_count: {
                    increment: 1
                }
            },
            where: {
                id: {
                    in: blogs.map((blog) => blog.id)
                }
            }
        })

        return blogs.map(({ author, ...blog }) => ({
            ...blog,
            author: author.name,
            authorEmail: author.email,
        }));
    } catch (error) {
        throw new Error("Failed to get blog list", { cause: error })
    }
}