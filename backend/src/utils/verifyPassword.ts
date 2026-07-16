import { compare } from "bcrypt"


export const verifyPassword = async (password: string, hashedPassword: string): Promise<boolean> => {
    try {
        return await compare(password, hashedPassword)
    } catch (error) {
        throw new Error("Invalid password")
    }
}