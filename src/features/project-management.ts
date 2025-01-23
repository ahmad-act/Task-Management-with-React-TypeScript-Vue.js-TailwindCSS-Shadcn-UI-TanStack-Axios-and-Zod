import { useId } from 'react';
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"

import { getQueryKey, getQueryKeyWithUrlQueryParams } from '@/lib/app-utils';

import { apiResponseSchema } from './../schemas/commonSchema';
import { FilterType, ApiResponseType } from "@/schemas/commonSchema"
import { ProjectType, ProjectListType, ProjectFindOneRequestType, ProjectCreateRequestType, ProjectUpdateRequestType, ProjectDeleteRequestType } from '@/schemas/projectSchema';
import ProjectService from "../api/project-service"

const QUERY_KEY = "projects"

export function useProjectFind(filters: FilterType) {
    console.log("🚀 ~ file: project-management.ts:13 ~ useProjectFind ~ filters:", filters)
    console.log("🚀 ~ file: project-management.ts:29 ~ useProjectFind ~ QUERY_KEY:", QUERY_KEY)

    const uniqueQueryKey = (filters.searchTerm ?? "") + filters.page + filters.pageSize + filters.sortColumn + filters.sortOrder;
    console.log("🚀 ~ file: project-management.ts:16 ~ useProjectFind ~ uniqueQueryKey:", uniqueQueryKey)

    const { isPending, data: response, error, status, isStale } = useQuery<
        ApiResponseType | null,
        Error
    >({
        queryKey: getQueryKey(QUERY_KEY, uniqueQueryKey),
        queryFn: async () => {
            return await ProjectService.find(filters);
        },
        staleTime: 5000, // Prevent frequent refreshes
        retry: 1, // Retry only once on failure
    })

    console.log("🚀 ~ file: project-management.ts:19 ~ useProjectFind ~ response?.data:", response?.data)

    const defaultTask: ProjectListType = {
        items: [],
        links: [],
        page: 1,
        pageSize: 10,
        totalCount: 0,
        totalPages: 1,
        hasNextPage: false,
        hasPreviousPage: false,
    };

    console.log("🚀 ~ file: project-management.ts:39 ~ useProjectFind ~ defaultTask:", defaultTask)

    return {
        isPending,
        data: response?.data as ProjectListType ?? defaultTask,
        error
    }
}

export function useProjectFindOne(findOne: ProjectFindOneRequestType) {
    console.log("🚀 ~ file: project-management.ts:54 ~ useProjectFindOne ~ findOne:", findOne)
    console.log("🚀 ~ file: project-management.ts:68 ~ useProjectFindOne ~ QUERY_KEY:", QUERY_KEY)

    const { isPending, data: response, error, status, isStale } = useQuery<
        ApiResponseType | null,
        Error
    >({
        queryKey: getQueryKey(QUERY_KEY, findOne.dataId.id),

        queryFn: async () => {
            return await ProjectService.findOne(findOne);
        },
        staleTime: 5000, // Prevent frequent refreshes
        retry: 1, // Retry only once on failure
    })

    console.log("🚀 ~ file: project-management.ts:58 ~ useProjectFindOne ~ response?.data:", response?.data)

    const defaultTask: ProjectType = {
        id: '',
        name: '',
        description: '',
        userDataAccessLevel: 0,
        links: [],
    };

    console.log("🚀 ~ file: project-management.ts:79 ~ useProjectFindOne ~ defaultTask:", defaultTask)

    return {
        isPending,
        data: response?.data as ProjectType ?? defaultTask,
        error
    }
}

export function useProjectCreate() {
    const queryClient = useQueryClient();
    const tempId = useId();
    const currentQueryKeyWithUrlQueryParams = getQueryKeyWithUrlQueryParams(QUERY_KEY);
    console.log("🚀 ~ file: project-management.ts:91 ~ useProjectCreate ~ tempId:", tempId)
    console.log("🚀 ~ file: project-management.ts:94 ~ useProjectCreate ~ currentQueryKeyWithUrlQueryParams:", currentQueryKeyWithUrlQueryParams)

    const { mutate, isError, error, data } = useMutation<
        ApiResponseType | null,
        Error,
        ProjectCreateRequestType,
        any
    >({
        mutationFn: ProjectService.createOne,

        // Optimistic update: This is executed before the mutation
        onMutate: async (newProjectData) => {
            await queryClient.cancelQueries({ queryKey: currentQueryKeyWithUrlQueryParams }); // Cancel ongoing queries
            console.log("🚀 ~ onMutate: ~ newProjectData:", newProjectData);

            // Ensure to get the correct query key
            const previousProjects = queryClient.getQueryData<ApiResponseType>(currentQueryKeyWithUrlQueryParams);
            console.log("🚀 ~ onMutate: ~ previousProjects:", previousProjects);

            // Check if the previous data exists
            if (previousProjects) {
                const newProjectDataWithId = {
                    ...newProjectData,
                    id: tempId, // Add or override the `id` property
                };

                console.log("🚀 ~ file: project-management.ts:173 ~ onMutate: ~ newProjectDataWithId:", newProjectDataWithId)

                // Optimistically update the cache
                queryClient.setQueryData<ApiResponseType>(currentQueryKeyWithUrlQueryParams, (oldData: ApiResponseType | undefined) => {
                    // Only update if oldData exists
                    console.log("🚀 ~ file: project-management.ts:95 ~ queryClient.setQueryData<ApiResponseType> ~ oldData:", oldData)
                    if (oldData?.data) {

                        const optimisticData = {
                            isSuccess: true,
                            data: {
                                ...oldData.data, // Preserve other properties in `data`
                                items: [...oldData.data.items, newProjectDataWithId], // Add the new project to `items`
                            },
                            message: 'Optimistic project creation',
                            errors: [], // No errors during optimistic update
                        };

                        console.log("🚀 ~ file: project-management.ts:117 ~ queryClient.setQueryData<ApiResponseType> ~ optimisticData:", optimisticData)
                        console.log("🚀 ~ file: project-management.ts:117 ~ queryClient.setQueryData<ApiResponseType> ~ optimisticData.data:", optimisticData.data)
                        return optimisticData;
                    }

                    // Fallback if no previous data is found (ensure it matches ApiResponseType)
                    return {
                        isSuccess: true,  // Assuming success for fallback
                        message: 'Fallback project data',
                        errors: [], // No errors
                        data: {
                            items: [newProjectData], // Add the new project as the only item
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
                return { previousProjects };
            }

            return { previousProjects: undefined };
        },

        // On success, refetch the projects or handle success accordingly
        onSuccess: async (data, variables) => {
            console.log("🚀 ~ file: project-management.ts:123 ~ useProjectCreate ~ data:", data)

            // Optimistically update the cache
            queryClient.setQueryData<ApiResponseType>(currentQueryKeyWithUrlQueryParams, (optimisticData) => {
                // Only update if oldData exists
                console.log("🚀 ~ file: project-management.ts:95 ~ queryClient.setQueryData<ApiResponseType> ~ optimisticData:", optimisticData)
                console.log("🚀 ~ file: project-management.ts:173 ~ queryClient.setQueryData<ApiResponseType> ~ optimisticData.data:", optimisticData?.data)

                if (optimisticData) {

                    const updatedItems = optimisticData.data.items.map((item: ProjectType) =>
                        item.id === tempId ? { ...item, id: data?.data } : item
                    );

                    const createdData = {
                        isSuccess: true,
                        data: {
                            ...optimisticData.data, // Preserve other properties in `data`
                            items: updatedItems, // Updated items with the ID change
                        },
                        message: 'Optimistic project creation',
                        errors: [], // No errors during optimistic update
                    };

                    console.log("🚀 ~ file: project-management.ts:117 ~ queryClient.setQueryData<ApiResponseType> ~ optimisticData:", createdData)
                    console.log("🚀 ~ file: project-management.ts:117 ~ queryClient.setQueryData<ApiResponseType> ~ optimisticData.data:", createdData.data)
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
                console.log('Project created:', validatedData.data);
            } else {
                console.error('Invalid response data:', validatedData.error.errors);
            }
        },

        // On error, roll back the optimistic update
        onError: (error, _, context) => {
            console.log("🚀 ~ file: project-management.ts:209 ~ useProjectCreate ~ context:", context)
            console.error('Error creating project:', error);

            // Rollback to the previous data if the mutation fails
            if (context?.previousProjects) {
                queryClient.setQueryData<ApiResponseType>(currentQueryKeyWithUrlQueryParams, context.previousProjects);
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
        mutate, // This is the function you will call to create the project
        isError, // Whether the mutation is in progress
        message: error?.message ?? data?.message, // The error message (if any)
        data, // The result of the mutation (e.g., newly created project)
    };
}

export function useProjectUpdate() {
    const queryClient = useQueryClient();
    const currentQueryKeyWithUrlQueryParams = getQueryKeyWithUrlQueryParams(QUERY_KEY);
    console.log("🚀 ~ file: project-management.ts:267 ~ useProjectUpdate ~ currentQueryKeyWithUrlQueryParams:", currentQueryKeyWithUrlQueryParams)

    const { mutate, isError, error, data } = useMutation<
        ApiResponseType | null,
        Error,
        ProjectUpdateRequestType,
        any
    >({
        mutationFn: ProjectService.updateOne,

        onMutate: async (updatedData) => {
            console.log("🚀 ~ file: project-management.ts:299 ~ onMutate: ~ updatedData:", updatedData)
            await queryClient.cancelQueries({ queryKey: currentQueryKeyWithUrlQueryParams });

            const previousProjects = queryClient.getQueryData<ApiResponseType>(currentQueryKeyWithUrlQueryParams);

            if (previousProjects) {
                queryClient.setQueryData<ApiResponseType>(currentQueryKeyWithUrlQueryParams, (oldData) => {
                    if (!oldData?.data) return oldData;

                    const updatedItems = oldData.data.items.map((item: ProjectType) =>
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

            return { previousProjects };
        },

        onSuccess: (_, variables) => {
            queryClient.setQueryData<ApiResponseType>(currentQueryKeyWithUrlQueryParams, (oldData) => {
                if (!oldData?.data) return oldData;

                const updatedItems = oldData.data.items.map((item: ProjectType) =>
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
            console.error("Error updating project:", error);
            if (context?.previousProjects) {
                queryClient.setQueryData<ApiResponseType>(
                    currentQueryKeyWithUrlQueryParams,
                    context.previousProjects
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

export function useProjectDelete() {
    const queryClient = useQueryClient();
    const currentQueryKeyWithUrlQueryParams = getQueryKeyWithUrlQueryParams(QUERY_KEY);
    console.log("🚀 ~ file: project-management.ts:352 ~ useProjectDelete ~ currentQueryKeyWithUrlQueryParams:", currentQueryKeyWithUrlQueryParams)

    const { mutate, isError, error, data } = useMutation<
        ApiResponseType | null,
        Error,
        ProjectDeleteRequestType,
        any
    >({
        mutationFn: ProjectService.deleteOne,

        // Optimistic Update: Perform cache updates before the mutation
        onMutate: async (deletedData) => {
            console.log("🚀 ~ onMutate: ~ deletedData:", deletedData);

            await queryClient.cancelQueries({ queryKey: currentQueryKeyWithUrlQueryParams });

            // Get the current cached data
            const previousProjects = queryClient.getQueryData<ApiResponseType>(
                currentQueryKeyWithUrlQueryParams
            );

            // Optimistically update the cache
            if (previousProjects?.data?.items) {
                queryClient.setQueryData<ApiResponseType>(currentQueryKeyWithUrlQueryParams, (oldData) => {
                    if (!oldData?.data) return oldData;

                    const updatedItems = oldData.data.items.filter(
                        (item: ProjectType) => item.id !== deletedData.dataId.id
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
            return { previousProjects };
        },

        // Handle successful mutation
        onSuccess: (_, variables) => {
            console.log("🚀 ~ onSuccess: ~ Deleted successfully:", variables);

            // Remove the deleted item from the cache
            queryClient.setQueryData<ApiResponseType>(currentQueryKeyWithUrlQueryParams, (oldData) => {
                if (!oldData?.data?.items) return oldData;

                const updatedItems = oldData.data.items.filter(
                    (item: ProjectType) => item.id !== variables.dataId.id
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
            console.error("Error deleting project:", error);

            // Restore previous data in case of an error
            if (context?.previousProjects) {
                queryClient.setQueryData<ApiResponseType>(
                    currentQueryKeyWithUrlQueryParams,
                    context.previousProjects
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