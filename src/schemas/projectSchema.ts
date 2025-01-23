import { z } from "zod"
import { linkSchema } from "./commonSchema";
import { workspaceSchema } from "./workspaceSchema";

export const projectSchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string().optional(),
  status: z.string(),
  workspaceId: z.string(),
  userDataAccessLevel: z.number(),
  links: z.array(z.array(linkSchema)),
  workspace: workspaceSchema.optional()
});

export const projectListSchema = z.object({
  items: z.array(projectSchema),

  page: z.number(),
  pageSize: z.number(),
  totalCount: z.number(),
  totalPages: z.number(),

  links: z.array(linkSchema),

  hasNextPage: z.boolean(),
  hasPreviousPage: z.boolean()
});

export const projectCreateRequestSchema = projectSchema.pick({
  name: true,
  description: true,
  status: true,
  workspaceId: true,
  userDataAccessLevel: true
})

export const projectIdRequestSchema = projectSchema.pick({
  id: true
})

export const projectFindOneRequestSchema = z.object({
  dataId: projectIdRequestSchema,
})

export const projectUpdateDataRequestSchema = projectSchema.pick({
  name: true,
  description: true,
  status: true,
  workspaceId: true,
  userDataAccessLevel: true
})

export const projectUpdateRequestSchema = z.object({
  dataId: projectIdRequestSchema,
  data: projectUpdateDataRequestSchema
})

export const projectDeleteRequestSchema = z.object({
  dataId: projectIdRequestSchema,
})

export const projectFormDataSchema = projectSchema.pick({
  id: true,
  name: true,
  description: true,
  status: true,
  workspaceId: true,
  workspace: true,
  //workspaceName: z.string(),
  userDataAccessLevel: true
})

export type ProjectType = z.infer<typeof projectSchema>;
export type ProjectListType = z.infer<typeof projectListSchema>;

export type ProjectFindOneRequestType = z.infer<typeof projectFindOneRequestSchema>;

export type ProjectCreateRequestType = z.infer<typeof projectCreateRequestSchema>;

export type ProjectUpdateDataRequestType = z.infer<typeof projectUpdateDataRequestSchema>;
export type ProjectUpdateRequestType = z.infer<typeof projectUpdateRequestSchema>;

export type ProjectDeleteRequestType = z.infer<typeof projectDeleteRequestSchema>;

export type ProjectFormDataSchema = z.infer<typeof projectFormDataSchema>;
