import z from "zod";

// user registration validator
export const registerSchema = z.object({
    fullName: z.string().min(1),
    email: z.email(),
    password: z.string().min(8),
});

// login validator
export const loginSchema = z.object({
    email: z.email(),
    password: z.string().min(1),
});

// refresh validator
export const refreshSchema = z.object({
    refreshToken: z.string().min(1),
});
