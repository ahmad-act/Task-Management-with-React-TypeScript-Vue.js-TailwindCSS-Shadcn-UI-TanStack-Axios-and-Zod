import { useId } from 'react';
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"

import { getQueryKey, getQueryKeyWithUrlQueryParams } from '@/lib/app-utils';

import { apiResponseSchema } from './../schemas/commonSchema';
import { FilterType, ApiResponseType } from "@/schemas/commonSchema"
import { IssueType, IssueListType, IssueFindOneRequestType, IssueCreateRequestType, IssueUpdateRequestType, IssueDeleteRequestType } from '@/schemas/issueSchema';
import IssueService from "../api/issue-service"

const QUERY_KEY = "issues"

export function useIssueFind(filters: FilterType) {
    console.log("🚀 ~ file: issue-management.ts:13 ~ useIssueFind ~ filters:", filters)
    console.log("🚀 ~ file: issue-management.ts:29 ~ useIssueFind ~ QUERY_KEY:", QUERY_KEY)

    const uniqueQueryKey = (filters.searchTerm ?? "") + filters.page + filters.pageSize + filters.sortColumn + filters.sortOrder;
    console.log("🚀 ~ file: issue-management.ts:16 ~ useIssueFind ~ uniqueQueryKey:", uniqueQueryKey)

    const { isPending, data: response, error, status, isStale } = useQuery<
        ApiResponseType | null,
        Error
    >({
        queryKey: getQueryKey(QUERY_KEY, uniqueQueryKey),
        queryFn: async () => {
            return await IssueService.find(filters);
        },
        staleTime: 5000, // Prevent frequent refreshes
        retry: 1, // Retry only once on failure
    })

    console.log("🚀 ~ file: issue-management.ts:19 ~ useIssueFind ~ response?.data:", response?.data)

    const defaultTask: IssueListType = {
        items: [],
        links: [],
        page: 1,
        pageSize: 10,
        totalCount: 0,
        totalPages: 1,
        hasNextPage: false,
        hasPreviousPage: false,
    };

    console.log("🚀 ~ file: issue-management.ts:39 ~ useIssueFind ~ defaultTask:", defaultTask)

    return {
        isPending,
        data: response?.data as IssueListType ?? defaultTask,
        error
    }
}

export function useIssueFindOne(findOne: IssueFindOneRequestType) {
    console.log("🚀 ~ file: issue-management.ts:54 ~ useIssueFindOne ~ findOne:", findOne)
    console.log("🚀 ~ file: issue-management.ts:68 ~ useIssueFindOne ~ QUERY_KEY:", QUERY_KEY)

    const { isPending, data: response, error, status, isStale } = useQuery<
        ApiResponseType | null,
        Error
    >({
        queryKey: getQueryKey(QUERY_KEY, findOne.dataId.id),

        queryFn: async () => {
            return await IssueService.findOne(findOne);
        },
        staleTime: 5000, // Prevent frequent refreshes
        retry: 1, // Retry only once on failure
    })

    console.log("🚀 ~ file: issue-management.ts:58 ~ useIssueFindOne ~ response?.data:", response?.data)

    const defaultTask: IssueType = {
        id: '',
        name: '',
        description: '',
        userDataAccessLevel: 0,
        links: [],
    };

    console.log("🚀 ~ file: issue-management.ts:79 ~ useIssueFindOne ~ defaultTask:", defaultTask)

    return {
        isPending,
        data: response?.data as IssueType ?? defaultTask,
        error
    }
}

export function useIssueCreate() {
    const queryClient = useQueryClient();
    const tempId = useId();
    const currentQueryKeyWithUrlQueryParams = getQueryKeyWithUrlQueryParams(QUERY_KEY);
    console.log("🚀 ~ file: issue-management.ts:91 ~ useIssueCreate ~ tempId:", tempId)
    console.log("🚀 ~ file: issue-management.ts:94 ~ useIssueCreate ~ currentQueryKeyWithUrlQueryParams:", currentQueryKeyWithUrlQueryParams)

    const { mutate, isError, error, data } = useMutation<
        ApiResponseType | null,
        Error,
        IssueCreateRequestType,
        any
    >({
        mutationFn: IssueService.createOne,

        // Optimistic update: This is executed before the mutation
        onMutate: async (newIssueData) => {
            await queryClient.cancelQueries({ queryKey: currentQueryKeyWithUrlQueryParams }); // Cancel ongoing queries
            console.log("🚀 ~ onMutate: ~ newIssueData:", newIssueData);

            // Ensure to get the correct query key
            const previousIssues = queryClient.getQueryData<ApiResponseType>(currentQueryKeyWithUrlQueryParams);
            console.log("🚀 ~ onMutate: ~ previousIssues:", previousIssues);

            // Check if the previous data exists
            if (previousIssues) {
                const newIssueDataWithId = {
                    ...newIssueData,
                    id: tempId, // Add or override the `id` property
                };

                console.log("🚀 ~ file: issue-management.ts:173 ~ onMutate: ~ newIssueDataWithId:", newIssueDataWithId)

                // Optimistically update the cache
                queryClient.setQueryData<ApiResponseType>(currentQueryKeyWithUrlQueryParams, (oldData: ApiResponseType | undefined) => {
                    // Only update if oldData exists
                    console.log("🚀 ~ file: issue-management.ts:95 ~ queryClient.setQueryData<ApiResponseType> ~ oldData:", oldData)
                    if (oldData?.data) {

                        const optimisticData = {
                            isSuccess: true,
                            data: {
                                ...oldData.data, // Preserve other properties in `data`
                                items: [...oldData.data.items, newIssueDataWithId], // Add the new issue to `items`
                            },
                            message: 'Optimistic issue creation',
                            errors: [], // No errors during optimistic update
                        };

                        console.log("🚀 ~ file: issue-management.ts:117 ~ queryClient.setQueryData<ApiResponseType> ~ optimisticData:", optimisticData)
                        console.log("🚀 ~ file: issue-management.ts:117 ~ queryClient.setQueryData<ApiResponseType> ~ optimisticData.data:", optimisticData.data)
                        return optimisticData;
                    }

                    // Fallback if no previous data is found (ensure it matches ApiResponseType)
                    return {
                        isSuccess: true,  // Assuming success for fallback
                        message: 'Fallback issue data',
                        errors: [], // No errors
                        data: {
                            items: [newIssueData], // Add the new issue as the only item
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
                return { previousIssues };
            }

            return { previousIssues: undefined };
        },

        // On success, refetch the issues or handle success accordingly
        onSuccess: async (data, variables) => {
            console.log("🚀 ~ file: issue-management.ts:123 ~ useIssueCreate ~ data:", data)

            // Optimistically update the cache
            queryClient.setQueryData<ApiResponseType>(currentQueryKeyWithUrlQueryParams, (optimisticData) => {
                // Only update if oldData exists
                console.log("🚀 ~ file: issue-management.ts:95 ~ queryClient.setQueryData<ApiResponseType> ~ optimisticData:", optimisticData)
                console.log("🚀 ~ file: issue-management.ts:173 ~ queryClient.setQueryData<ApiResponseType> ~ optimisticData.data:", optimisticData?.data)

                if (optimisticData) {

                    const updatedItems = optimisticData.data.items.map((item: IssueType) =>
                        item.id === tempId ? { ...item, id: data?.data } : item
                    );

                    const createdData = {
                        isSuccess: true,
                        data: {
                            ...optimisticData.data, // Preserve other properties in `data`
                            items: updatedItems, // Updated items with the ID change
                        },
                        message: 'Optimistic issue creation',
                        errors: [], // No errors during optimistic update
                    };

                    console.log("🚀 ~ file: issue-management.ts:117 ~ queryClient.setQueryData<ApiResponseType> ~ optimisticData:", createdData)
                    console.log("🚀 ~ file: issue-management.ts:117 ~ queryClient.setQueryData<ApiResponseType> ~ optimisticData.data:", createdData.data)
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
                console.log('Issue created:', validatedData.data);
            } else {
                console.error('Invalid response data:', validatedData.error.errors);
            }
        },

        // On error, roll back the optimistic update
        onError: (error, _, context) => {
            console.log("🚀 ~ file: issue-management.ts:209 ~ useIssueCreate ~ context:", context)
            console.error('Error creating issue:', error);

            // Rollback to the previous data if the mutation fails
            if (context?.previousIssues) {
                queryClient.setQueryData<ApiResponseType>(currentQueryKeyWithUrlQueryParams, context.previousIssues);
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
        mutate, // This is the function you will call to create the issue
        isError, // Whether the mutation is in progress
        message: error?.message ?? data?.message, // The error message (if any)
        data, // The result of the mutation (e.g., newly created issue)
    };
}

export function useIssueUpdate() {
    const queryClient = useQueryClient();
    const currentQueryKeyWithUrlQueryParams = getQueryKeyWithUrlQueryParams(QUERY_KEY);
    console.log("🚀 ~ file: issue-management.ts:267 ~ useIssueUpdate ~ currentQueryKeyWithUrlQueryParams:", currentQueryKeyWithUrlQueryParams)

    const { mutate, isError, error, data } = useMutation<
        ApiResponseType | null,
        Error,
        IssueUpdateRequestType,
        any
    >({
        mutationFn: IssueService.updateOne,

        onMutate: async (updatedData) => {
            console.log("🚀 ~ file: issue-management.ts:299 ~ onMutate: ~ updatedData:", updatedData)
            await queryClient.cancelQueries({ queryKey: currentQueryKeyWithUrlQueryParams });

            const previousIssues = queryClient.getQueryData<ApiResponseType>(currentQueryKeyWithUrlQueryParams);

            if (previousIssues) {
                queryClient.setQueryData<ApiResponseType>(currentQueryKeyWithUrlQueryParams, (oldData) => {
                    if (!oldData?.data) return oldData;

                    const updatedItems = oldData.data.items.map((item: IssueType) =>
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

            return { previousIssues };
        },

        onSuccess: (_, variables) => {
            queryClient.setQueryData<ApiResponseType>(currentQueryKeyWithUrlQueryParams, (oldData) => {
                if (!oldData?.data) return oldData;

                const updatedItems = oldData.data.items.map((item: IssueType) =>
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
            console.error("Error updating issue:", error);
            if (context?.previousIssues) {
                queryClient.setQueryData<ApiResponseType>(
                    currentQueryKeyWithUrlQueryParams,
                    context.previousIssues
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

export function useIssueDelete() {
    const queryClient = useQueryClient();
    const currentQueryKeyWithUrlQueryParams = getQueryKeyWithUrlQueryParams(QUERY_KEY);
    console.log("🚀 ~ file: issue-management.ts:352 ~ useIssueDelete ~ currentQueryKeyWithUrlQueryParams:", currentQueryKeyWithUrlQueryParams)

    const { mutate, isError, error, data } = useMutation<
        ApiResponseType | null,
        Error,
        IssueDeleteRequestType,
        any
    >({
        mutationFn: IssueService.deleteOne,

        // Optimistic Update: Perform cache updates before the mutation
        onMutate: async (deletedData) => {
            console.log("🚀 ~ onMutate: ~ deletedData:", deletedData);

            await queryClient.cancelQueries({ queryKey: currentQueryKeyWithUrlQueryParams });

            // Get the current cached data
            const previousIssues = queryClient.getQueryData<ApiResponseType>(
                currentQueryKeyWithUrlQueryParams
            );

            // Optimistically update the cache
            if (previousIssues?.data?.items) {
                queryClient.setQueryData<ApiResponseType>(currentQueryKeyWithUrlQueryParams, (oldData) => {
                    if (!oldData?.data) return oldData;

                    const updatedItems = oldData.data.items.filter(
                        (item: IssueType) => item.id !== deletedData.dataId.id
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
            return { previousIssues };
        },

        // Handle successful mutation
        onSuccess: (_, variables) => {
            console.log("🚀 ~ onSuccess: ~ Deleted successfully:", variables);

            // Remove the deleted item from the cache
            queryClient.setQueryData<ApiResponseType>(currentQueryKeyWithUrlQueryParams, (oldData) => {
                if (!oldData?.data?.items) return oldData;

                const updatedItems = oldData.data.items.filter(
                    (item: IssueType) => item.id !== variables.dataId.id
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
            console.error("Error deleting issue:", error);

            // Restore previous data in case of an error
            if (context?.previousIssues) {
                queryClient.setQueryData<ApiResponseType>(
                    currentQueryKeyWithUrlQueryParams,
                    context.previousIssues
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