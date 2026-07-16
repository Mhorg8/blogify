import { prisma } from "../../config/db.ts"

export const likeBlogService = async (blogId: string) => {
    const blog = await prisma.blog.findUnique({
        where: {
            id: blogId
        }
    })

    if (!blog) {
        throw new Error("Blog not found")
    }

    await prisma.blog.update({
        where: {
            id: blogId
        },
        data: {
            like_count: blog.like_count + 1
        },
    })
}