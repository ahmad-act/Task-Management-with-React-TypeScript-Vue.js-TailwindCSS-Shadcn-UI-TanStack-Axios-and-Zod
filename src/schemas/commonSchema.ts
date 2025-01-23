import { z } from "zod"

export const filterSchema = z.object({
    searchTerm: z.string().nullable().optional(),
    page: z.number().nullable().optional(),
    pageSize: z.number().nullable().optional(),
    sortColumn: z.string().nullable().optional(),
    sortOrder: z.string().nullable().optional(),
});

export const linkSchema = z.object({
    method: z.string().optional(),
    url: z.string().optional(),
    operation: z.string().optional(),
});

// Error object schema
export const errorSchema = z.object({
    statusCode: z.number(),
    status: z.string(),
    description: z.string(),
});

// ApiResponse schema
export const apiResponseSchema = z.object({
    isSuccess: z.boolean(),
    data: z.any().nullable(), // Accepts any type of data or null
    message: z.string(),
    errors: z.array(errorSchema).nullable(),
});


export type FilterType = z.infer<typeof filterSchema>

export type LinkType = z.infer<typeof linkSchema>

export type ErrorType = z.infer<typeof errorSchema>
export type ApiResponseType = z.infer<typeof apiResponseSchema>
