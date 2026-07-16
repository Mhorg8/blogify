import { prisma } from "../../config/db.ts"

export const getBlogList = async () => {
    try {
        const blogs = await prisma.blog.findMany()
        return blogs
    } catch (error) {
        throw new Error("Failed to get blog list", { cause: error })
    }
}