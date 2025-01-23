import { useId } from 'react';
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"

import { getQueryKey, getQueryKeyWithUrlQueryParams } from '@/lib/app-utils';

import { apiResponseSchema } from './../schemas/commonSchema';
import { FilterType, ApiResponseType } from "@/schemas/commonSchema"
import { TaskType, TaskListType, TaskFindOneRequestType, TaskCreateRequestType, TaskUpdateRequestType, TaskDeleteRequestType } from '@/schemas/taskSchema';
import TaskService from "../api/task-service"

const QUERY_KEY = "tasks"

export function useTaskFind(filters: FilterType) {
    console.log("🚀 ~ file: task-management.ts:13 ~ useTaskFind ~ filters:", filters)
    console.log("🚀 ~ file: task-management.ts:29 ~ useTaskFind ~ QUERY_KEY:", QUERY_KEY)

    const uniqueQueryKey = (filters.searchTerm ?? "") + filters.page + filters.pageSize + filters.sortColumn + filters.sortOrder;
    console.log("🚀 ~ file: task-management.ts:16 ~ useTaskFind ~ uniqueQueryKey:", uniqueQueryKey)

    const { isPending, data: response, error, status, isStale } = useQuery<
        ApiResponseType | null,
        Error
    >({
        queryKey: getQueryKey(QUERY_KEY, uniqueQueryKey),
        queryFn: async () => {
            return await TaskService.find(filters);
        },
        staleTime: 5000, // Prevent frequent refreshes
        retry: 1, // Retry only once on failure
    })

    console.log("🚀 ~ file: task-management.ts:19 ~ useTaskFind ~ response?.data:", response?.data)

    const defaultTask: TaskListType = {
        items: [],
        links: [],
        page: 1,
        pageSize: 10,
        totalCount: 0,
        totalPages: 1,
        hasNextPage: false,
        hasPreviousPage: false,
    };

    console.log("🚀 ~ file: task-management.ts:39 ~ useTaskFind ~ defaultTask:", defaultTask)

    return {
        isPending,
        data: response?.data as TaskListType ?? defaultTask,
        error
    }
}

export function useTaskFindOne(findOne: TaskFindOneRequestType) {
    console.log("🚀 ~ file: task-management.ts:54 ~ useTaskFindOne ~ findOne:", findOne)
    console.log("🚀 ~ file: task-management.ts:68 ~ useTaskFindOne ~ QUERY_KEY:", QUERY_KEY)

    const { isPending, data: response, error, status, isStale } = useQuery<
        ApiResponseType | null,
        Error
    >({
        queryKey: getQueryKey(QUERY_KEY, findOne.dataId.id),

        queryFn: async () => {
            return await TaskService.findOne(findOne);
        },
        staleTime: 5000, // Prevent frequent refreshes
        retry: 1, // Retry only once on failure
    })

    console.log("🚀 ~ file: task-management.ts:58 ~ useTaskFindOne ~ response?.data:", response?.data)

    const defaultTask: TaskType = {
        id: '',
        name: '',
        description: '',
        userDataAccessLevel: 0,
        links: [],
    };

    console.log("🚀 ~ file: task-management.ts:79 ~ useTaskFindOne ~ defaultTask:", defaultTask)

    return {
        isPending,
        data: response?.data as TaskType ?? defaultTask,
        error
    }
}

export function useTaskCreate() {
    const queryClient = useQueryClient();
    const tempId = useId();
    const currentQueryKeyWithUrlQueryParams = getQueryKeyWithUrlQueryParams(QUERY_KEY);
    console.log("🚀 ~ file: task-management.ts:91 ~ useTaskCreate ~ tempId:", tempId)
    console.log("🚀 ~ file: task-management.ts:94 ~ useTaskCreate ~ currentQueryKeyWithUrlQueryParams:", currentQueryKeyWithUrlQueryParams)

    const { mutate, isError, error, data } = useMutation<
        ApiResponseType | null,
        Error,
        TaskCreateRequestType,
        any
    >({
        mutationFn: TaskService.createOne,

        // Optimistic update: This is executed before the mutation
        onMutate: async (newTaskData) => {
            await queryClient.cancelQueries({ queryKey: currentQueryKeyWithUrlQueryParams }); // Cancel ongoing queries
            console.log("🚀 ~ onMutate: ~ newTaskData:", newTaskData);

            // Ensure to get the correct query key
            const previousTasks = queryClient.getQueryData<ApiResponseType>(currentQueryKeyWithUrlQueryParams);
            console.log("🚀 ~ onMutate: ~ previousTasks:", previousTasks);

            // Check if the previous data exists
            if (previousTasks) {
                const newTaskDataWithId = {
                    ...newTaskData,
                    id: tempId, // Add or override the `id` property
                };

                console.log("🚀 ~ file: task-management.ts:173 ~ onMutate: ~ newTaskDataWithId:", newTaskDataWithId)

                // Optimistically update the cache
                queryClient.setQueryData<ApiResponseType>(currentQueryKeyWithUrlQueryParams, (oldData: ApiResponseType | undefined) => {
                    // Only update if oldData exists
                    console.log("🚀 ~ file: task-management.ts:95 ~ queryClient.setQueryData<ApiResponseType> ~ oldData:", oldData)
                    if (oldData?.data) {

                        const optimisticData = {
                            isSuccess: true,
                            data: {
                                ...oldData.data, // Preserve other properties in `data`
                                items: [...oldData.data.items, newTaskDataWithId], // Add the new task to `items`
                            },
                            message: 'Optimistic task creation',
                            errors: [], // No errors during optimistic update
                        };

                        console.log("🚀 ~ file: task-management.ts:117 ~ queryClient.setQueryData<ApiResponseType> ~ optimisticData:", optimisticData)
                        console.log("🚀 ~ file: task-management.ts:117 ~ queryClient.setQueryData<ApiResponseType> ~ optimisticData.data:", optimisticData.data)
                        return optimisticData;
                    }

                    // Fallback if no previous data is found (ensure it matches ApiResponseType)
                    return {
                        isSuccess: true,  // Assuming success for fallback
                        message: 'Fallback task data',
                        errors: [], // No errors
                        data: {
                            items: [newTaskData], // Add the new task as the only item
                        },
                        page: 1,
                        pageSize: 10,
                        totalCount: 1,
                        totalPages: 1,
                        hasNextPage: false,
                        hasPreviousPage: false,
                        links: [],
                    };
                });

                // Return context for rollback
                return { previousTasks };
            }

            return { previousTasks: undefined };
        },

        // On success, refetch the tasks or handle success accordingly
        onSuccess: async (data, variables) => {
            console.log("🚀 ~ file: task-management.ts:123 ~ useTaskCreate ~ data:", data)

            // Optimistically update the cache
            queryClient.setQueryData<ApiResponseType>(currentQueryKeyWithUrlQueryParams, (optimisticData) => {
                // Only update if oldData exists
                console.log("🚀 ~ file: task-management.ts:95 ~ queryClient.setQueryData<ApiResponseType> ~ optimisticData:", optimisticData)
                console.log("🚀 ~ file: task-management.ts:173 ~ queryClient.setQueryData<ApiResponseType> ~ optimisticData.data:", optimisticData?.data)

                if (optimisticData) {

                    const updatedItems = optimisticData.data.items.map((item: TaskType) =>
                        item.id === tempId ? { ...item, id: data?.data } : item
                    );

                    const createdData = {
                        isSuccess: true,
                        data: {
                            ...optimisticData.data, // Preserve other properties in `data`
                            items: updatedItems, // Updated items with the ID change
                        },
                        message: 'Optimistic task creation',
                        errors: [], // No errors during optimistic update
                    };

                    console.log("🚀 ~ file: task-management.ts:117 ~ queryClient.setQueryData<ApiResponseType> ~ optimisticData:", createdData)
                    console.log("🚀 ~ file: task-management.ts:117 ~ queryClient.setQueryData<ApiResponseType> ~ optimisticData.data:", createdData.data)
                    return createdData.data;
                }

                //Fallback if no previous data is found
                return {
                    items: [
                        {
                            id: data?.data,
                            name: variables.name,
                            description: variables.description,
                            userDataAccessLevel: variables.userDataAccessLevel,
                            links: []
                        }
                    ],
                    page: 1,
                    pageSize: 10,
                    totalCount: 1,
                    totalPages: 1,
                    hasNextPage: false,
                    hasPreviousPage: false,
                    links: [],
                };
            });


            // Perform any updates or optimistic updates
            await queryClient.refetchQueries({ queryKey: currentQueryKeyWithUrlQueryParams }); // Refetch the data


            // Validate the response using the schema to ensure it matches the expected structure
            const validatedData = apiResponseSchema.safeParse(data);

            if (validatedData.success) {
                console.log('Task created:', validatedData.data);
            } else {
                console.error('Invalid response data:', validatedData.error.errors);
            }
        },

        // On error, roll back the optimistic update
        onError: (error, _, context) => {
            console.log("🚀 ~ file: task-management.ts:209 ~ useTaskCreate ~ context:", context)
            console.error('Error creating task:', error);

            // Rollback to the previous data if the mutation fails
            if (context?.previousTasks) {
                queryClient.setQueryData<ApiResponseType>(currentQueryKeyWithUrlQueryParams, context.previousTasks);
            }
        },

        // Optionally, handle when the mutation is completed, success or error
        onSettled: () => {
            console.log("🚀 onSettled: () 🚀");

            queryClient.invalidateQueries({ queryKey: currentQueryKeyWithUrlQueryParams });
        },
    });


    // Return the mutate function and necessary data for the component using this hook
    return {
        mutate, // This is the function you will call to create the task
        isError, // Whether the mutation is in progress
        message: error?.message ?? data?.message, // The error message (if any)
        data, // The result of the mutation (e.g., newly created task)
    };
}

export function useTaskUpdate() {
    const queryClient = useQueryClient();
    const currentQueryKeyWithUrlQueryParams = getQueryKeyWithUrlQueryParams(QUERY_KEY);
    console.log("🚀 ~ file: task-management.ts:267 ~ useTaskUpdate ~ currentQueryKeyWithUrlQueryParams:", currentQueryKeyWithUrlQueryParams)

    const { mutate, isError, error, data } = useMutation<
        ApiResponseType | null,
        Error,
        TaskUpdateRequestType,
        any
    >({
        mutationFn: TaskService.updateOne,

        onMutate: async (updatedData) => {
            console.log("🚀 ~ file: task-management.ts:299 ~ onMutate: ~ updatedData:", updatedData)
            await queryClient.cancelQueries({ queryKey: currentQueryKeyWithUrlQueryParams });

            const previousTasks = queryClient.getQueryData<ApiResponseType>(currentQueryKeyWithUrlQueryParams);

            if (previousTasks) {
                queryClient.setQueryData<ApiResponseType>(currentQueryKeyWithUrlQueryParams, (oldData) => {
                    if (!oldData?.data) return oldData;

                    const updatedItems = oldData.data.items.map((item: TaskType) =>
                        item.id === updatedData.dataId.id
                            ? { ...item, ...updatedData.data }
                            : item
                    );

                    return {
                        ...oldData,
                        data: {
                            ...oldData.data,
                            items: updatedItems,
                        },
                    };
                });
            }

            return { previousTasks };
        },

        onSuccess: (_, variables) => {
            queryClient.setQueryData<ApiResponseType>(currentQueryKeyWithUrlQueryParams, (oldData) => {
                if (!oldData?.data) return oldData;

                const updatedItems = oldData.data.items.map((item: TaskType) =>
                    item.id === variables.dataId.id ? { ...item, ...variables.data } : item
                );

                return {
                    ...oldData,
                    data: {
                        ...oldData.data,
                        items: updatedItems,
                    },
                };
            });

            queryClient.invalidateQueries({ queryKey: currentQueryKeyWithUrlQueryParams });
        },

        onError: (error, _, context) => {
            console.error("Error updating task:", error);
            if (context?.previousTasks) {
                queryClient.setQueryData<ApiResponseType>(
                    currentQueryKeyWithUrlQueryParams,
                    context.previousTasks
                );
            }
        },

        onSettled: () => {
            queryClient.invalidateQueries({ queryKey: currentQueryKeyWithUrlQueryParams });
        },
    });

    return {
        mutate,
        isError,
        message: error?.message ?? data?.message,
        data,
    };
}

export function useTaskDelete() {
    const queryClient = useQueryClient();
    const currentQueryKeyWithUrlQueryParams = getQueryKeyWithUrlQueryParams(QUERY_KEY);
    console.log("🚀 ~ file: task-management.ts:352 ~ useTaskDelete ~ currentQueryKeyWithUrlQueryParams:", currentQueryKeyWithUrlQueryParams)

    const { mutate, isError, error, data } = useMutation<
        ApiResponseType | null,
        Error,
        TaskDeleteRequestType,
        any
    >({
        mutationFn: TaskService.deleteOne,

        // Optimistic Update: Perform cache updates before the mutation
        onMutate: async (deletedData) => {
            console.log("🚀 ~ onMutate: ~ deletedData:", deletedData);

            await queryClient.cancelQueries({ queryKey: currentQueryKeyWithUrlQueryParams });

            // Get the current cached data
            const previousTasks = queryClient.getQueryData<ApiResponseType>(
                currentQueryKeyWithUrlQueryParams
            );

            // Optimistically update the cache
            if (previousTasks?.data?.items) {
                queryClient.setQueryData<ApiResponseType>(currentQueryKeyWithUrlQueryParams, (oldData) => {
                    if (!oldData?.data) return oldData;

                    const updatedItems = oldData.data.items.filter(
                        (item: TaskType) => item.id !== deletedData.dataId.id
                    );

                    return {
                        ...oldData,
                        data: {
                            ...oldData.data,
                            items: updatedItems,
                        },
                    };
                });
            }

            // Return the context for rollback in case of an error
            return { previousTasks };
        },

        // Handle successful mutation
        onSuccess: (_, variables) => {
            console.log("🚀 ~ onSuccess: ~ Deleted successfully:", variables);

            // Remove the deleted item from the cache
            queryClient.setQueryData<ApiResponseType>(currentQueryKeyWithUrlQueryParams, (oldData) => {
                if (!oldData?.data?.items) return oldData;

                const updatedItems = oldData.data.items.filter(
                    (item: TaskType) => item.id !== variables.dataId.id
                );

                return {
                    ...oldData,
                    data: {
                        ...oldData.data,
                        items: updatedItems,
                    },
                };
            });

            // Invalidate queries to refresh the data
            queryClient.invalidateQueries({ queryKey: currentQueryKeyWithUrlQueryParams });

            // Remove the cache for the specific query key
            queryClient.removeQueries({
                queryKey: getQueryKey(QUERY_KEY, variables.dataId.id),
                exact: true, // Ensure it removes only the exact match
            });
        },

        // Rollback on error
        onError: (error, _, context) => {
            console.error("Error deleting task:", error);

            // Restore previous data in case of an error
            if (context?.previousTasks) {
                queryClient.setQueryData<ApiResponseType>(
                    currentQueryKeyWithUrlQueryParams,
                    context.previousTasks
                );
            }
        },

        // After mutation completes (success or error)
        onSettled: () => {
            console.log("🚀 ~ onSettled: Cleanup or final actions");
            queryClient.invalidateQueries({ queryKey: currentQueryKeyWithUrlQueryParams });
        },
    });

    return {
        mutate, // Function to trigger the delete
        isError,
        message: error?.message ?? "Deleted successfully",
        data, // Result is void, but useful for further handling
    };
}