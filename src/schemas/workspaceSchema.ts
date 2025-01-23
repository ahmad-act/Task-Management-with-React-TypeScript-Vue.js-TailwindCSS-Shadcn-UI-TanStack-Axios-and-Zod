import { z } from "zod"
import { linkSchema } from "./commonSchema";

export const workspaceSchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string().optional(),
  userDataAccessLevel: z.number(),
  links: z.array(z.array(linkSchema))
});

export const workspaceListSchema = z.object({
  items: z.array(workspaceSchema),

  page: z.number(),
  pageSize: z.number(),
  totalCount: z.number(),
  totalPages: z.number(),

  links: z.array(linkSchema),

  hasNextPage: z.boolean(),
  hasPreviousPage: z.boolean()
});

export const workspaceCreateRequestSchema = workspaceSchema.pick({
  name: true,
  description: true,
  userDataAccessLevel: true
})

export const workspaceIdRequestSchema = workspaceSchema.pick({
  id: true
})

export const workspaceFindOneRequestSchema = z.object({
  dataId: workspaceIdRequestSchema,
})

export const workspaceUpdateDataRequestSchema = workspaceSchema.pick({
  name: true,
  description: true,
  userDataAccessLevel: true
})

export const workspaceUpdateRequestSchema = z.object({
  dataId: workspaceIdRequestSchema,
  data: workspaceUpdateDataRequestSchema
})

export const workspaceDeleteRequestSchema = z.object({
  dataId: workspaceIdRequestSchema,
})

export const workspaceFormDataSchema = workspaceSchema.pick({
  id: true,
  name: true,
  description: true,
  userDataAccessLevel: true
})

export type WorkspaceType= z.infer<typeof workspaceSchema>;
export type WorkspaceListType = z.infer<typeof workspaceListSchema>;

export type WorkspaceFindOneRequestType = z.infer<typeof workspaceFindOneRequestSchema>;

export type WorkspaceCreateRequestType = z.infer<typeof workspaceCreateRequestSchema>;

export type WorkspaceUpdateDataRequestType = z.infer<typeof workspaceUpdateDataRequestSchema>;
export type WorkspaceUpdateRequestType = z.infer<typeof workspaceUpdateRequestSchema>;

export type WorkspaceDeleteRequestType = z.infer<typeof workspaceDeleteRequestSchema>;

export type WorkspaceFormDataSchema = z.infer<typeof workspaceFormDataSchema>;
