import { prisma } from "../../config/db.ts";
import type { CreateBlogRequest } from "../../validators/createBlogValidator.ts";

export const createBlogService = async (data: CreateBlogRequest, userId: string) => {
    const { title, Description, image, short_description } = data;

    const blog = await prisma.blog.create({
        data: {
            title,
            Description,
            image: image ? [image] : [],
            short_description,
            authorId: userId,
            like_count: 0,
            view_count: 0,
        },
        include: {
            author: {
                select: {
                    name: true,
                    email: true,
                },
            },
        },
    });

    return {
        ...blog,
        author: blog.author.name,
    };
};