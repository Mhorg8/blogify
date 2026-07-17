import { AppError } from "../../errors/AppError.ts";
import { prisma } from "../../config/db.ts";
import type { CreateBlogRequest } from "../../validators/createBlogValidator.ts";
import type { CreateCommentRequest } from "../../validators/createCommentValidator.ts";

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
                comments: {
                    select: {
                        content: true,
                        createdAt: true,
                        author: {
                            select: {
                                name: true,
                                email: true,
                            },
                        },
                    },
                    orderBy: { createdAt: "desc" },
                },
                blogLikes: userId
                    ? { where: { userId }, select: { id: true } }
                    : false,
            },
        });

        return blogs.map(({ author, blogLikes, comments, ...blog }) => ({
            ...blog,
            author: author.name,
            authorEmail: author.email,
            liked: Array.isArray(blogLikes) ? blogLikes.length > 0 : false,
            comments: comments.map((comment) => ({
                content: comment.content,
                createdAt: comment.createdAt,
                commenter: {
                    name: comment.author.name,
                    email: comment.author.email,
                },
            })),
        }));
    } catch (error) {
        throw new AppError(500, "Failed to get blog list")
    }
}


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


export const createCommentService = async ({ blogId, content }: CreateCommentRequest, userId: string) => {
    const comment = await prisma.comment.create({
        data: {
            content,
            blogId: blogId,
            authorId: userId,
        },
        include: {
            author: true,
        },
    })
    return comment
}



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
