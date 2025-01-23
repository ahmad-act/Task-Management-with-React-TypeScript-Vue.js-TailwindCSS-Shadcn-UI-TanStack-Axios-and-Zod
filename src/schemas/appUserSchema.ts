import { z } from "zod"
import { linkSchema } from "./commonSchema";

export const appUserSchema = z.object({
    firstName: z.string().nullable().optional(),
    lastName: z.string().nullable().optional(),
    userType: z.string().nullable().optional(),
    createdBy: z.string().nullable().optional(),
    createdAt: z.string().nullable().optional(),
    modifiedAt: z.string().nullable().optional(),
    userAccessLevel: z.number().optional(),
    userDataAccessLevel: z.number().optional(),
    id: z.string(),
    userName: z.string(),
    email: z.string().email(),
    normalizedUserName: z.string().optional(), // Username string in uppercase
    normalizedEmail: z.string().optional(), // Email string in uppercase
    emailConfirmed: z.boolean().optional(),
    password: z.string(),
    securityStamp: z.string().optional(),
    concurrencyStamp: z.string().optional(),
    phoneNumber: z.string().nullable().optional(),
    phoneNumberConfirmed: z.boolean().optional(),
    twoFactorEnabled: z.boolean().optional(),
    lockoutEnd: z.string().nullable().optional(), // Nullable ISO timestamp or null
    lockoutEnabled: z.boolean().optional(),
    accessFailedCount: z.number().optional(),
    rememberMe: z.boolean().nullable().optional(),
});

export const appUserListSchema = z.object({
    items: z.array(appUserSchema),

    page: z.number(),
    pageSize: z.number(),
    totalCount: z.number(),
    totalPages: z.number(),

    links: z.array(linkSchema),

    hasNextPage: z.boolean(),
    hasPreviousPage: z.boolean()
});

export const appUserCreateRequestSchema = appUserSchema.pick({
    firstName: true,
    lastName: true,
    userDataAccessLevel: true,
    userName: true,
    email: true,
    password: true,
})

export const appUserIdRequestSchema = appUserSchema.pick({
    id: true
})

export const appUserUpdateDataRequestSchema = appUserSchema.pick({
    firstName: true,
    lastName: true,
    userDataAccessLevel: true,
    userName: true,
    email: true,
    password: true,
})

export const appUserUpdateRequestSchema = z.object({
    dataId: appUserIdRequestSchema,
    data: appUserUpdateDataRequestSchema
})

export const appUserDeleteRequestSchema = z.object({
    dataId: appUserIdRequestSchema,
})

export const appUserFormDataSchema = appUserSchema.pick({
    id: true,
    userName: true,
    password: true,
    email: true,
    userDataAccessLevel: true
})

export const loginRequestSchema = appUserSchema.pick({
    userName: true,
    password: true,
    rememberMe: true
})

export type AppUserType = z.infer<typeof appUserSchema>;
export type AppUserListType = z.infer<typeof appUserListSchema>;

export type AppUserCreateRequestType = z.infer<typeof appUserCreateRequestSchema>;

export type AppUserUpdateDataRequestType = z.infer<typeof appUserUpdateDataRequestSchema>;
export type AppUserUpdateRequestType = z.infer<typeof appUserUpdateRequestSchema>;
export type AppUserDeleteRequestType = z.infer<typeof appUserDeleteRequestSchema>;

export type AppUserFormDataType = z.infer<typeof appUserFormDataSchema>;

export type LoginRequestType = z.infer<typeof loginRequestSchema>;
