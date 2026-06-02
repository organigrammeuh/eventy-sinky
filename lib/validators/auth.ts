import z from "zod";

export const registerSchema = z.object({
    fullName: z.string().min(1),
    email: z.email(),
    password: z.string().min(8)
})