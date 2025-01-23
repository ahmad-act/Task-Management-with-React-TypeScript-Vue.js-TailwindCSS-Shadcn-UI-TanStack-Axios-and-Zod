import { z } from "zod"
import { linkSchema } from "./commonSchema";
import { projectSchema } from "./projectSchema";

export const taskSchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string().optional(),
  status: z.string(),
  projectId: z.string(),
  userDataAccessLevel: z.number(),
  links: z.array(z.array(linkSchema)),
  project: projectSchema.optional()
});

export const taskListSchema = z.object({
  items: z.array(taskSchema),

  page: z.number(),
  pageSize: z.number(),
  totalCount: z.number(),
  totalPages: z.number(),

  links: z.array(linkSchema),

  hasNextPage: z.boolean(),
  hasPreviousPage: z.boolean()
});

export const taskCreateRequestSchema = taskSchema.pick({
  name: true,
  description: true,
  status: true,
  projectId: true,
  userDataAccessLevel: true
})

export const taskIdRequestSchema = taskSchema.pick({
  id: true
})

export const taskFindOneRequestSchema = z.object({
  dataId: taskIdRequestSchema,
})

export const taskUpdateDataRequestSchema = taskSchema.pick({
  name: true,
  description: true,
  status: true,
  projectId: true,
  userDataAccessLevel: true
})

export const taskUpdateRequestSchema = z.object({
  dataId: taskIdRequestSchema,
  data: taskUpdateDataRequestSchema
})

export const taskDeleteRequestSchema = z.object({
  dataId: taskIdRequestSchema,
})

export const taskFormDataSchema = taskSchema.pick({
  id: true,
  name: true,
  description: true,
  status: true,
  projectId: true,
  userDataAccessLevel: true,
  project: true
})

export type TaskType= z.infer<typeof taskSchema>;
export type TaskListType = z.infer<typeof taskListSchema>;

export type TaskFindOneRequestType = z.infer<typeof taskFindOneRequestSchema>;

export type TaskCreateRequestType = z.infer<typeof taskCreateRequestSchema>;

export type TaskUpdateDataRequestType = z.infer<typeof taskUpdateDataRequestSchema>;
export type TaskUpdateRequestType = z.infer<typeof taskUpdateRequestSchema>;

export type TaskDeleteRequestType = z.infer<typeof taskDeleteRequestSchema>;

export type TaskFormDataSchema = z.infer<typeof taskFormDataSchema>;
