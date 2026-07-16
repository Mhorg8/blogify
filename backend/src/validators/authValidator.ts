import { string, object, type Infer } from "zod";

export const registerSchema = object({
    name: string()
        .trim()
        .min(2, "Name must be at least 2 characters long")
        .max(50, "Name must be less than 50 characters long"),
    email: string()
        .trim()
        .toLowerCase()
        .email("Invalid email address"),
    password: string()
        .trim()
        .min(8, "Password must be at least 8 characters long")
        .max(50, "Password must be less than 50 characters long"),
})


export type RegisterInput = Infer<typeof registerSchema>;
