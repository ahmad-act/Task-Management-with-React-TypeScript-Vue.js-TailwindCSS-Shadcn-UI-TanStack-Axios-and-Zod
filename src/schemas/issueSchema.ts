import { z } from "zod"
import { linkSchema } from "./commonSchema";
import { projectSchema } from "./projectSchema";

export const issueSchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string().optional(),
  status: z.string(),
  projectId: z.string(),
  userDataAccessLevel: z.number(),
  links: z.array(z.array(linkSchema)),
  project: projectSchema.optional()
});

export const issueListSchema = z.object({
  items: z.array(issueSchema),

  page: z.number(),
  pageSize: z.number(),
  totalCount: z.number(),
  totalPages: z.number(),

  links: z.array(linkSchema),

  hasNextPage: z.boolean(),
  hasPreviousPage: z.boolean()
});

export const issueCreateRequestSchema = issueSchema.pick({
  name: true,
  description: true,
  status: true,
  projectId: true,
  userDataAccessLevel: true
})

export const issueIdRequestSchema = issueSchema.pick({
  id: true
})

export const issueFindOneRequestSchema = z.object({
  dataId: issueIdRequestSchema,
})

export const issueUpdateDataRequestSchema = issueSchema.pick({
  name: true,
  description: true,
  status: true,
  projectId: true,
  userDataAccessLevel: true
})

export const issueUpdateRequestSchema = z.object({
  dataId: issueIdRequestSchema,
  data: issueUpdateDataRequestSchema
})

export const issueDeleteRequestSchema = z.object({
  dataId: issueIdRequestSchema,
})

export const issueFormDataSchema = issueSchema.pick({
  id: true,
  name: true,
  description: true,
  status: true,
  projectId: true,
  userDataAccessLevel: true,
  project: true
})

export type IssueType = z.infer<typeof issueSchema>;
export type IssueListType = z.infer<typeof issueListSchema>;

export type IssueFindOneRequestType = z.infer<typeof issueFindOneRequestSchema>;

export type IssueCreateRequestType = z.infer<typeof issueCreateRequestSchema>;

export type IssueUpdateDataRequestType = z.infer<typeof issueUpdateDataRequestSchema>;
export type IssueUpdateRequestType = z.infer<typeof issueUpdateRequestSchema>;

export type IssueDeleteRequestType = z.infer<typeof issueDeleteRequestSchema>;

export type IssueFormDataSchema = z.infer<typeof issueFormDataSchema>;
