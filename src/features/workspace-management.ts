import { useId } from 'react';
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"

import { getQueryKey, getQueryKeyWithUrlQueryParams } from '@/lib/app-utils';

import { apiResponseSchema } from './../schemas/commonSchema';
import { FilterType, ApiResponseType } from "@/schemas/commonSchema"
import { WorkspaceType, WorkspaceListType, WorkspaceFindOneRequestType, WorkspaceCreateRequestType, WorkspaceUpdateRequestType, WorkspaceDeleteRequestType } from '@/schemas/workspaceSchema';
import WorkspaceService from "../api/workspace-service"

const QUERY_KEY = "workspaces"

export function useWorkspaceFind(filters: FilterType) {
    console.log("🚀 ~ file: workspace-management.ts:13 ~ useWorkspaceFind ~ filters:", filters)
    console.log("🚀 ~ file: workspace-management.ts:29 ~ useWorkspaceFind ~ QUERY_KEY:", QUERY_KEY)

    const uniqueQueryKey = (filters.searchTerm ?? "") + filters.page + filters.pageSize + filters.sortColumn + filters.sortOrder;
    console.log("🚀 ~ file: workspace-management.ts:16 ~ useWorkspaceFind ~ uniqueQueryKey:", uniqueQueryKey)

    const { isPending, data: response, error, status, isStale } = useQuery<
        ApiResponseType | null,
        Error
    >({
        queryKey: getQueryKey(QUERY_KEY, uniqueQueryKey),
        queryFn: async () => {
            return await WorkspaceService.find(filters);
        },
        staleTime: 5000, // Prevent frequent refreshes
        retry: 1, // Retry only once on failure
    })

    console.log("🚀 ~ file: workspace-management.ts:19 ~ useWorkspaceFind ~ response?.data:", response?.data)

    const defaultTask: WorkspaceListType = {
        items: [],
        links: [],
        page: 1,
        pageSize: 10,
        totalCount: 0,
        totalPages: 1,
        hasNextPage: false,
        hasPreviousPage: false,
    };

    console.log("🚀 ~ file: workspace-management.ts:39 ~ useWorkspaceFind ~ defaultTask:", defaultTask)

    return {
        isPending,
        data: response?.data as WorkspaceListType ?? defaultTask,
        error
    }
}

export function useWorkspaceFindOne(findOne: WorkspaceFindOneRequestType) {
    console.log("🚀 ~ file: workspace-management.ts:54 ~ useWorkspaceFindOne ~ findOne:", findOne)
    console.log("🚀 ~ file: workspace-management.ts:68 ~ useWorkspaceFindOne ~ QUERY_KEY:", QUERY_KEY)

    const { isPending, data: response, error, status, isStale } = useQuery<
        ApiResponseType | null,
        Error
    >({
        queryKey: getQueryKey(QUERY_KEY, findOne.dataId.id),

        queryFn: async () => {
            return await WorkspaceService.findOne(findOne);
        },
        staleTime: 5000, // Prevent frequent refreshes
        retry: 1, // Retry only once on failure
    })

    console.log("🚀 ~ file: workspace-management.ts:58 ~ useWorkspaceFindOne ~ response?.data:", response?.data)

    const defaultTask: WorkspaceType = {
        id: '',
        name: '',
        description: '',
        userDataAccessLevel: 0,
        links: [],
    };

    console.log("🚀 ~ file: workspace-management.ts:79 ~ useWorkspaceFindOne ~ defaultTask:", defaultTask)

    return {
        isPending,
        data: response?.data as WorkspaceType ?? defaultTask,
        error
    }
}

export function useWorkspaceCreate() {
    const queryClient = useQueryClient();
    const tempId = useId();
    const currentQueryKeyWithUrlQueryParams = getQueryKeyWithUrlQueryParams(QUERY_KEY);
    console.log("🚀 ~ file: workspace-management.ts:91 ~ useWorkspaceCreate ~ tempId:", tempId)
    console.log("🚀 ~ file: workspace-management.ts:94 ~ useWorkspaceCreate ~ currentQueryKeyWithUrlQueryParams:", currentQueryKeyWithUrlQueryParams)

    const { mutate, isError, error, data } = useMutation<
        ApiResponseType | null,
        Error,
        WorkspaceCreateRequestType,
        any
    >({
        mutationFn: WorkspaceService.createOne,

        // Optimistic update: This is executed before the mutation
        onMutate: async (newWorkspaceData) => {
            await queryClient.cancelQueries({ queryKey: currentQueryKeyWithUrlQueryParams }); // Cancel ongoing queries
            console.log("🚀 ~ onMutate: ~ newWorkspaceData:", newWorkspaceData);

            // Ensure to get the correct query key
            const previousWorkspaces = queryClient.getQueryData<ApiResponseType>(currentQueryKeyWithUrlQueryParams);
            console.log("🚀 ~ onMutate: ~ previousWorkspaces:", previousWorkspaces);

            // Check if the previous data exists
            if (previousWorkspaces) {
                const newWorkspaceDataWithId = {
                    ...newWorkspaceData,
                    id: tempId, // Add or override the `id` property
                };

                console.log("🚀 ~ file: workspace-management.ts:173 ~ onMutate: ~ newWorkspaceDataWithId:", newWorkspaceDataWithId)

                // Optimistically update the cache
                queryClient.setQueryData<ApiResponseType>(currentQueryKeyWithUrlQueryParams, (oldData: ApiResponseType | undefined) => {
                    // Only update if oldData exists
                    console.log("🚀 ~ file: workspace-management.ts:95 ~ queryClient.setQueryData<ApiResponseType> ~ oldData:", oldData)
                    if (oldData?.data) {

                        const optimisticData = {
                            isSuccess: true,
                            data: {
                                ...oldData.data, // Preserve other properties in `data`
                                items: [...oldData.data.items, newWorkspaceDataWithId], // Add the new workspace to `items`
                            },
                            message: 'Optimistic workspace creation',
                            errors: [], // No errors during optimistic update
                        };

                        console.log("🚀 ~ file: workspace-management.ts:117 ~ queryClient.setQueryData<ApiResponseType> ~ optimisticData:", optimisticData)
                        console.log("🚀 ~ file: workspace-management.ts:117 ~ queryClient.setQueryData<ApiResponseType> ~ optimisticData.data:", optimisticData.data)
                        return optimisticData;
                    }

                    // Fallback if no previous data is found (ensure it matches ApiResponseType)
                    return {
                        isSuccess: true,  // Assuming success for fallback
                        message: 'Fallback workspace data',
                        errors: [], // No errors
                        data: {
                            items: [newWorkspaceData], // Add the new workspace as the only item
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
                return { previousWorkspaces };
            }

            return { previousWorkspaces: undefined };
        },

        // On success, refetch the workspaces or handle success accordingly
        onSuccess: async (data, variables) => {
            console.log("🚀 ~ file: workspace-management.ts:123 ~ useWorkspaceCreate ~ data:", data)

            // Optimistically update the cache
            queryClient.setQueryData<ApiResponseType>(currentQueryKeyWithUrlQueryParams, (optimisticData) => {
                // Only update if oldData exists
                console.log("🚀 ~ file: workspace-management.ts:95 ~ queryClient.setQueryData<ApiResponseType> ~ optimisticData:", optimisticData)
                console.log("🚀 ~ file: workspace-management.ts:173 ~ queryClient.setQueryData<ApiResponseType> ~ optimisticData.data:", optimisticData?.data)

                if (optimisticData) {

                    const updatedItems = optimisticData.data.items.map((item: WorkspaceType) =>
                        item.id === tempId ? { ...item, id: data?.data } : item
                    );

                    const createdData = {
                        isSuccess: true,
                        data: {
                            ...optimisticData.data, // Preserve other properties in `data`
                            items: updatedItems, // Updated items with the ID change
                        },
                        message: 'Optimistic workspace creation',
                        errors: [], // No errors during optimistic update
                    };

                    console.log("🚀 ~ file: workspace-management.ts:117 ~ queryClient.setQueryData<ApiResponseType> ~ optimisticData:", createdData)
                    console.log("🚀 ~ file: workspace-management.ts:117 ~ queryClient.setQueryData<ApiResponseType> ~ optimisticData.data:", createdData.data)
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
                console.log('Workspace created:', validatedData.data);
            } else {
                console.error('Invalid response data:', validatedData.error.errors);
            }
        },

        // On error, roll back the optimistic update
        onError: (error, _, context) => {
            console.log("🚀 ~ file: workspace-management.ts:209 ~ useWorkspaceCreate ~ context:", context)
            console.error('Error creating workspace:', error);

            // Rollback to the previous data if the mutation fails
            if (context?.previousWorkspaces) {
                queryClient.setQueryData<ApiResponseType>(currentQueryKeyWithUrlQueryParams, context.previousWorkspaces);
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
        mutate, // This is the function you will call to create the workspace
        isError, // Whether the mutation is in progress
        message: error?.message ?? data?.message, // The error message (if any)
        data, // The result of the mutation (e.g., newly created workspace)
    };
}

export function useWorkspaceUpdate() {
    const queryClient = useQueryClient();
    const currentQueryKeyWithUrlQueryParams = getQueryKeyWithUrlQueryParams(QUERY_KEY);
    console.log("🚀 ~ file: workspace-management.ts:267 ~ useWorkspaceUpdate ~ currentQueryKeyWithUrlQueryParams:", currentQueryKeyWithUrlQueryParams)

    const { mutate, isError, error, data } = useMutation<
        ApiResponseType | null,
        Error,
        WorkspaceUpdateRequestType,
        any
    >({
        mutationFn: WorkspaceService.updateOne,

        onMutate: async (updatedData) => {
            console.log("🚀 ~ file: workspace-management.ts:299 ~ onMutate: ~ updatedData:", updatedData)
            await queryClient.cancelQueries({ queryKey: currentQueryKeyWithUrlQueryParams });

            const previousWorkspaces = queryClient.getQueryData<ApiResponseType>(currentQueryKeyWithUrlQueryParams);

            if (previousWorkspaces) {
                queryClient.setQueryData<ApiResponseType>(currentQueryKeyWithUrlQueryParams, (oldData) => {
                    if (!oldData?.data) return oldData;

                    const updatedItems = oldData.data.items.map((item: WorkspaceType) =>
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

            return { previousWorkspaces };
        },

        onSuccess: (_, variables) => {
            queryClient.setQueryData<ApiResponseType>(currentQueryKeyWithUrlQueryParams, (oldData) => {
                if (!oldData?.data) return oldData;

                const updatedItems = oldData.data.items.map((item: WorkspaceType) =>
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
            console.error("Error updating workspace:", error);
            if (context?.previousWorkspaces) {
                queryClient.setQueryData<ApiResponseType>(
                    currentQueryKeyWithUrlQueryParams,
                    context.previousWorkspaces
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

export function useWorkspaceDelete() {
    const queryClient = useQueryClient();
    const currentQueryKeyWithUrlQueryParams = getQueryKeyWithUrlQueryParams(QUERY_KEY);
    console.log("🚀 ~ file: workspace-management.ts:352 ~ useWorkspaceDelete ~ currentQueryKeyWithUrlQueryParams:", currentQueryKeyWithUrlQueryParams)

    const { mutate, isError, error, data } = useMutation<
        ApiResponseType | null,
        Error,
        WorkspaceDeleteRequestType,
        any
    >({
        mutationFn: WorkspaceService.deleteOne,

        // Optimistic Update: Perform cache updates before the mutation
        onMutate: async (deletedData) => {
            console.log("🚀 ~ onMutate: ~ deletedData:", deletedData);

            await queryClient.cancelQueries({ queryKey: currentQueryKeyWithUrlQueryParams });

            // Get the current cached data
            const previousWorkspaces = queryClient.getQueryData<ApiResponseType>(
                currentQueryKeyWithUrlQueryParams
            );

            // Optimistically update the cache
            if (previousWorkspaces?.data?.items) {
                queryClient.setQueryData<ApiResponseType>(currentQueryKeyWithUrlQueryParams, (oldData) => {
                    if (!oldData?.data) return oldData;

                    const updatedItems = oldData.data.items.filter(
                        (item: WorkspaceType) => item.id !== deletedData.dataId.id
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
            return { previousWorkspaces };
        },

        // Handle successful mutation
        onSuccess: (_, variables) => {
            console.log("🚀 ~ onSuccess: ~ Deleted successfully:", variables);

            // Remove the deleted item from the cache
            queryClient.setQueryData<ApiResponseType>(currentQueryKeyWithUrlQueryParams, (oldData) => {
                if (!oldData?.data?.items) return oldData;

                const updatedItems = oldData.data.items.filter(
                    (item: WorkspaceType) => item.id !== variables.dataId.id
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
            console.error("Error deleting workspace:", error);

            // Restore previous data in case of an error
            if (context?.previousWorkspaces) {
                queryClient.setQueryData<ApiResponseType>(
                    currentQueryKeyWithUrlQueryParams,
                    context.previousWorkspaces
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