import { string, object, type infer as Infer } from "zod";

export const createCommentSchema = object({
    blogId: string().trim().min(1, "Blog ID is required"),
    content: string().trim().min(1, "Content is required"),
})

export type CreateCommentRequest = Infer<typeof createCommentSchema>