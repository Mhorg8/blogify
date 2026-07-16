import { string, object, type Infer } from 'zod'

export const createBlogSchema = object({
    title: string().trim().min(3, "Title must be at least 3 characters long"),
    short_description: string().trim().min(10, "Short description must be at least 10 characters long").max(60, "Short description must be less than 60 characters long"),
    Description: string().trim().min(10, "Description must be at least 100 characters long"),
    image: string().trim().min(1, "Image is required").nullable(),
})

export type CreateBlogRequest = Infer<typeof createBlogSchema>;