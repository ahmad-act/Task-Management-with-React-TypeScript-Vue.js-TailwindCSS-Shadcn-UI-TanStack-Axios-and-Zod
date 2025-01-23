import { apiResponseSchema } from './../schemas/commonSchema';
import { AppUserType, AppUserListType, AppUserCreateRequestType, AppUserUpdateRequestType, AppUserDeleteRequestType, LoginRequestType } from '@/schemas/appUserSchema';
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import AppUserService from "../api/appuser-service"
import { ApiResponseType, FilterType } from "@/schemas/commonSchema"
import { useId } from 'react';
import { getQueryKey, getQueryKeyWithUrlQueryParams } from '@/lib/app-utils';

const QUERY_KEY = "app-users"

export function useAppUserFind(filters: FilterType) {
    console.log("🚀 ~ file: appUser-management.ts:18 ~ useAppUserFind ~ filters:", filters)

    const uniqueQueryKey = (filters.searchTerm ?? "") + filters.page + filters.pageSize + filters.sortColumn + filters.sortOrder;
    console.log("🚀 ~ file: appUser-management.ts:21 ~ useAppUserFind ~ uniqueQueryKey:", uniqueQueryKey)

    const { isPending, data: response, error, status, isStale } = useQuery({
        queryKey: getQueryKey(QUERY_KEY, uniqueQueryKey),
        queryFn: async () => {
            return await AppUserService.find(filters);
        },
        staleTime: 5000, // Prevent frequent refreshes
        retry: 1, // Retry only once on failure
    })

    console.log("🚀 ~ file: appUser-management.ts:21 ~ useAppUserFind ~ data:", response)


    const defaultTask: AppUserListType = {
        items: [],
        links: [],
        page: 1,
        pageSize: 10,
        totalCount: 0,
        totalPages: 1,
        hasNextPage: false,
        hasPreviousPage: false,
    };

    return {
        isPending,
        data: response?.data ?? defaultTask,
        error
    }
}

export function useAppUserFindOne({ id }: { id: string }) {
    console.log("🚀 ~ file: appuser-management.ts:49 ~ useAppUserFindOne ~ id:", id)

    const { isPending, data: response, error, status, isStale } = useQuery({
        queryKey: getQueryKey(QUERY_KEY, id),

        queryFn: async () => {
            return await AppUserService.findOne(id);
        },
        staleTime: 5000, // Prevent frequent refreshes
        retry: 1, // Retry only once on failure
    })


    const defaultTask: AppUserType = {
        id: '',
        userName: '',
        password: '',
        email: '',
        userDataAccessLevel: 0,
    };

    console.log("🚀 ~ file: appuser-management.ts:75 ~ ", response?.data)

    return {
        isPending,
        data: response?.data ?? defaultTask,
        error
    }
}

export function useAppUserCreate() {
    const tempId = useId();
    const queryClient = useQueryClient();
    const currentQueryKeyWithUrlQueryParams = getQueryKeyWithUrlQueryParams(QUERY_KEY);

    const { mutate, isError, error, data } = useMutation<
        ApiResponseType | null,
        Error,
        AppUserCreateRequestType,
        any
    >({
        mutationFn: AppUserService.createOne,

        // Optimistic update: This is executed before the mutation
        onMutate: async (newAppUserData) => {
            await queryClient.cancelQueries({ queryKey: currentQueryKeyWithUrlQueryParams }); // Cancel ongoing queries
            console.log("🚀 ~ onMutate: ~ newAppUserData:", newAppUserData);

            // Ensure to get the correct query key
            const previousAppUsers = queryClient.getQueryData<ApiResponseType>(currentQueryKeyWithUrlQueryParams);

            console.log("🚀 ~ onMutate: ~ previousAppUsers:", previousAppUsers);

            // Check if the previous data exists
            if (previousAppUsers) {
                const newAppUserDataWithId = {
                    ...newAppUserData,
                    id: tempId, // Add or override the `id` property
                };

                console.log("🚀 ~ file: appUser-management.ts:173 ~ onMutate: ~ newAppUserDataWithId:", newAppUserDataWithId)

                // Optimistically update the cache
                queryClient.setQueryData<ApiResponseType>(currentQueryKeyWithUrlQueryParams, (oldData: ApiResponseType | undefined) => {
                    // Only update if oldData exists
                    console.log("🚀 ~ file: appUser-management.ts:95 ~ queryClient.setQueryData<ApiResponseType> ~ oldData:", oldData)
                    if (oldData?.data) {

                        const optimisticData = {
                            isSuccess: true,
                            data: {
                                ...oldData.data, // Preserve other properties in `data`
                                items: [...oldData.data.items, newAppUserDataWithId], // Add the new appUser to `items`
                            },
                            message: 'Optimistic appUser creation',
                            errors: [], // No errors during optimistic update
                        };

                        console.log("🚀 ~ file: appUser-management.ts:117 ~ queryClient.setQueryData<ApiResponseType> ~ optimisticData:", optimisticData)
                        console.log("🚀 ~ file: appUser-management.ts:117 ~ queryClient.setQueryData<ApiResponseType> ~ optimisticData.data:", optimisticData.data)
                        return optimisticData;
                    }

                    // Fallback if no previous data is found (ensure it matches ApiResponseType)
                    return {
                        isSuccess: true,  // Assuming success for fallback
                        message: 'Fallback appUser data',
                        errors: [], // No errors
                        data: {
                            items: [newAppUserData], // Add the new appUser as the only item
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
                return { previousAppUsers };
            }

            return { previousAppUsers: undefined };
        },

        // On success, refetch the appUsers or handle success accordingly
        onSuccess: async (data, variables) => {
            console.log("🚀 ~ file: appUser-management.ts:123 ~ useAppUserCreate ~ data:", data)

            // Optimistically update the cache
            queryClient.setQueryData<ApiResponseType>(currentQueryKeyWithUrlQueryParams, (optimisticData) => {
                // Only update if oldData exists
                console.log("🚀 ~ file: appUser-management.ts:95 ~ queryClient.setQueryData<ApiResponseType> ~ optimisticData:", optimisticData)
                console.log("🚀 ~ file: appUser-management.ts:173 ~ queryClient.setQueryData<ApiResponseType> ~ optimisticData.data:", optimisticData?.data)

                if (optimisticData) {

                    const updatedItems = optimisticData.data.items.map((item: AppUserType) =>
                        item.id === tempId ? { ...item, id: data?.data } : item
                    );

                    const createdData = {
                        isSuccess: true,
                        data: {
                            ...optimisticData.data, // Preserve other properties in `data`
                            items: updatedItems, // Updated items with the ID change
                        },
                        message: 'Optimistic appUser creation',
                        errors: [], // No errors during optimistic update
                    };

                    console.log("🚀 ~ file: appUser-management.ts:117 ~ queryClient.setQueryData<ApiResponseType> ~ optimisticData:", createdData)
                    console.log("🚀 ~ file: appUser-management.ts:117 ~ queryClient.setQueryData<ApiResponseType> ~ optimisticData.data:", createdData.data)
                    return createdData.data;
                }

                //Fallback if no previous data is found
                return {
                    items: [
                        {
                            id: data?.data,
                            userName: variables.userName,
                            password: variables.password,
                            email: variables.email,
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
                console.log('AppUser created:', validatedData.data);
            } else {
                console.error('Invalid response data:', validatedData.error.errors);
            }
        },

        // On error, roll back the optimistic update
        onError: (error, _, context) => {
            console.log("🚀 ~ file: appUser-management.ts:209 ~ useAppUserCreate ~ context:", context)
            console.error('Error creating appUser:', error);

            // Rollback to the previous data if the mutation fails
            if (context?.previousAppUsers) {
                queryClient.setQueryData<ApiResponseType>(currentQueryKeyWithUrlQueryParams, context.previousAppUsers);
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
        mutate, // This is the function you will call to create the appUser
        isError, // Whether the mutation is in progress
        message: error?.message ?? data?.message, // The error message (if any)
        data, // The result of the mutation (e.g., newly created appUser)
    };
}

export function useAppUserUpdate() {
    const queryClient = useQueryClient();
    const currentQueryKeyWithUrlQueryParams = getQueryKeyWithUrlQueryParams(QUERY_KEY);

    const { mutate, isError, error, data } = useMutation<
        ApiResponseType | null,
        Error,
        AppUserUpdateRequestType,
        any
    >({
        mutationFn: AppUserService.updateOne,

        onMutate: async (updatedData) => {
            console.log("🚀 ~ file: appUser-management.ts:299 ~ onMutate: ~ updatedData:", updatedData)
            await queryClient.cancelQueries({ queryKey: currentQueryKeyWithUrlQueryParams });

            const previousAppUsers = queryClient.getQueryData<ApiResponseType>(currentQueryKeyWithUrlQueryParams);

            if (previousAppUsers) {
                queryClient.setQueryData<ApiResponseType>(currentQueryKeyWithUrlQueryParams, (oldData) => {
                    if (!oldData?.data) return oldData;

                    const updatedItems = oldData.data.items.map((item: AppUserType) =>
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

            return { previousAppUsers };
        },

        onSuccess: (_, variables) => {
            queryClient.setQueryData<ApiResponseType>(currentQueryKeyWithUrlQueryParams, (oldData) => {
                if (!oldData?.data) return oldData;

                const updatedItems = oldData.data.items.map((item: AppUserType) =>
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
            console.error("Error updating appUser:", error);
            if (context?.previousAppUsers) {
                queryClient.setQueryData<ApiResponseType>(
                    currentQueryKeyWithUrlQueryParams,
                    context.previousAppUsers
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

export function useAppUserDelete() {
    const queryClient = useQueryClient();
    const currentQueryKeyWithUrlQueryParams = getQueryKeyWithUrlQueryParams(QUERY_KEY);

    const { mutate, isError, error, data } = useMutation<
        ApiResponseType | null,
        Error,
        AppUserDeleteRequestType,
        any
    >({
        mutationFn: AppUserService.deleteOne,

        // Optimistic Update: Perform cache updates before the mutation
        onMutate: async (deletedData) => {
            console.log("🚀 ~ onMutate: ~ deletedData:", deletedData);

            await queryClient.cancelQueries({ queryKey: currentQueryKeyWithUrlQueryParams });

            // Get the current cached data
            const previousAppUsers = queryClient.getQueryData<ApiResponseType>(
                currentQueryKeyWithUrlQueryParams
            );

            // Optimistically update the cache
            if (previousAppUsers?.data?.items) {
                queryClient.setQueryData<ApiResponseType>(currentQueryKeyWithUrlQueryParams, (oldData) => {
                    if (!oldData?.data) return oldData;

                    const updatedItems = oldData.data.items.filter(
                        (item: AppUserType) => item.id !== deletedData.dataId.id
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
            return { previousAppUsers };
        },

        // Handle successful mutation
        onSuccess: (_, variables) => {
            console.log("🚀 ~ onSuccess: ~ Deleted successfully:", variables);

            // Remove the deleted item from the cache
            queryClient.setQueryData<ApiResponseType>(currentQueryKeyWithUrlQueryParams, (oldData) => {
                if (!oldData?.data?.items) return oldData;

                const updatedItems = oldData.data.items.filter(
                    (item: AppUserType) => item.id !== variables.dataId.id
                );

                return {
                    ...oldData,
                    data: {
                        ...oldData.data,
                        items: updatedItems,
                    },
                };
            });

            // Optionally invalidate queries to refresh the data
            queryClient.invalidateQueries({ queryKey: currentQueryKeyWithUrlQueryParams });
        },

        // Rollback on error
        onError: (error, _, context) => {
            console.error("Error deleting appUser:", error);

            // Restore previous data in case of an error
            if (context?.previousAppUsers) {
                queryClient.setQueryData<ApiResponseType>(
                    currentQueryKeyWithUrlQueryParams,
                    context.previousAppUsers
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

export function useAppUserLogin(dataLogin: LoginRequestType) {
    console.log("🚀 ~ file: appuser-management.ts:437 ~ useAppUserLogin ~ dataLogin:", dataLogin)

    const { isPending, data: response, error, status, isStale } = useQuery({
        queryKey: getQueryKey(QUERY_KEY, dataLogin.userName + dataLogin.password),

        queryFn: async () => {
            return await AppUserService.login(dataLogin);
        },
        staleTime: 5000, // Prevent frequent refreshes
        retry: 1, // Retry only once on failure
    })

    console.log("🚀 ~ file: appuser-management.ts:75 ~ response?.data", response?.data)

    return {
        isPending,
        data: response?.data ?? '',
        error
    }
}