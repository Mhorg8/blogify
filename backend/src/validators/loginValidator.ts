import { object, string, type Infer } from "zod";

export const loginSchema = object({
    email: string()
        .trim()
        .toLowerCase()
        .email("Invalid email address"),
    password: string()
        .min(8, "Password must be at least 8 characters long")
        .max(50, "Password must be less than 50 characters long"),
})

export type loginInput = Infer<typeof loginSchema>;