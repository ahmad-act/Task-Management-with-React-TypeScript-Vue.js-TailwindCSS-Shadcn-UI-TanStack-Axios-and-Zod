import { api } from '.';
import { AppUserCreateRequestType, AppUserDeleteRequestType, AppUserUpdateRequestType, LoginRequestType } from '@/schemas/appUserSchema';
import { apiResponseSchema, ApiResponseType, FilterType } from '@/schemas/commonSchema';
import { getFormattedError } from '@/lib/app-utils';

const endpoint = '/app-users';

export default {
    find: async (filters: FilterType): Promise<ApiResponseType | null> => {
        console.log("🚀 ~ file: appUser-service.ts:10 ~ Find: ~ filters:", filters)

        const params = new URLSearchParams();

        // Construct query parameters
        if (filters.searchTerm) params.append('searchTerm', filters.searchTerm);
        if (filters.page !== undefined) params.append('page', String(filters.page));
        if (filters.pageSize !== undefined) params.append('pageSize', String(filters.pageSize));
        if (filters.sortColumn) params.append('sortColumn', filters.sortColumn);
        if (filters.sortOrder) params.append('sortOrder', filters.sortOrder);

        console.log("🚀 ~ file: appUser-service.ts:21 ~ find: ~ params.toString():", params.toString())
        console.log("🚀 ~ file: appUser-service.ts:26 ~ find: ~ ${endpoint}?${params.toString()}:", `${endpoint}?${params.toString()}`)

        try {
            const res = await api.get(`${endpoint}?${params.toString()}`);

            console.log("🚀 ~ file: appUser-service.ts:27 ~ find: ~ res.data:", res.data)

            // Validate API response by schema
            const validatedResponse = apiResponseSchema.safeParse(res.data);
            if (!validatedResponse.success) {
                console.warn("🚀 ~ file: appUser-service.ts:32 ~ find: ~ validatedResponse.error:", validatedResponse.error)
                throw new Error('Invalid API response structure: ' + validatedResponse.error);
            }

            return res.data as ApiResponseType;
        } catch (error: any) {
            console.error("🚀 ~ file: appUser-service.ts:38 ~ find: ~ error:", error)
            console.error("🚀 ~ file: appUser-service.ts:39 ~ find: ~ ApiResponse error:", error.response?.data)

            const errorData = error.response?.data as ApiResponseType;
            console.error("🚀 ~ file: appUser-service.ts:42 ~ find: ~ errorData:", errorData)
            getFormattedError(errorData); // This method failed to throw an error, the throw below error.

            console.error("🚀 ~ file: appUser-service.ts:45 ~ find: ~ error.message:", error.message)
            throw new Error(`Failed to retrieve appUser: ${error.message}`);
        }
    },

    findOne: async (id: string): Promise<ApiResponseType | null> => {
        console.log("🚀 ~ file: appUser-service.ts:51 ~ findOne: ~ id:", id)

        if (!id) {
            console.warn("🚀 ~ file: appUser-service.ts:54 ~ findOne: ~ id:", id)

            return {
                isSuccess: false,
                data: null,
                message: 'ID is required to fetch the appUser.',
                errors: [
                    {
                        statusCode: 400,
                        status: 'BadRequest',
                        description: 'The ID is required for this request.'
                    }
                ]
            };
        }

        console.log("🚀 ~ file: appUser-service.ts:70 ~ findOne: ~ ${endpoint}/${id}:", `${endpoint}/${id}`)

        try {
            const res = await api.get(`${endpoint}/${id}`);

            console.log("🚀 ~ file: appUser-service.ts:75 ~ findOne: ~ res.data:", res.data)

            // Validate API response by schema
            const validatedResponse = apiResponseSchema.safeParse(res.data);
            if (!validatedResponse.success) {
                console.warn("🚀 ~ file: appUser-service.ts:80 ~ findOne: ~ validatedResponse.error:", validatedResponse.error)
                throw new Error('Invalid API response structure: ' + validatedResponse.error);
            }

            return res.data as ApiResponseType;
        } catch (error: any) {
            console.error("🚀 ~ file: appUser-service.ts:86 ~ findOne: ~ error:", error)
            console.error("🚀 ~ file: appUser-service.ts:87 ~ findOne: ~ ApiResponse error:", error.response?.data)

            const errorData = error.response?.data as ApiResponseType;
            console.error("🚀 ~ file: appUser-service.ts:90 ~ findOne: ~ errorData:", errorData)
            getFormattedError(errorData); // This method failed to throw an error, the throw below error.

            console.error("🚀 ~ file: appUser-service.ts:93 ~ findOne: ~ error.message:", error.message)
            throw new Error(`Failed to get appUser: ${error.message}`);
        }
    },

    createOne: async (dataCreateOne: AppUserCreateRequestType): Promise<ApiResponseType | null> => {
        console.log("🚀 ~ file: appUser-service.ts:99 ~ createOne: ~ dataCreateOne:", dataCreateOne)
        console.log("🚀 ~ file: appUser-service.ts:100 ~ createOne: ~ endpoint:", endpoint)

        try {
            const res = await api.post(endpoint, dataCreateOne);

            console.log("🚀 ~ file: appUser-service.ts:105 ~ createOne: ~ res.data:", res.data)

            // Validate API response by schema
            const validatedResponse = apiResponseSchema.safeParse(res.data);
            if (!validatedResponse.success) {
                console.warn("🚀 ~ file: appUser-service.ts:110 ~ createOne: ~ validatedResponse.error:", validatedResponse.error)
                throw new Error('Invalid API response structure: ' + validatedResponse.error);
            }

            return res.data as ApiResponseType;
        } catch (error: any) {
            console.error("🚀 ~ file: appUser-service.ts:116 ~ CreateOne: ~ error:", error)
            console.error("🚀 ~ file: appUser-service.ts:117 ~ CreateOne: ~ ApiResponse error:", error.response?.data)

            const errorData = error.response?.data as ApiResponseType;
            console.error("🚀 ~ file: appUser-service.ts120 ~ CreateOne: ~ errorData:", errorData)
            getFormattedError(errorData); // This method failed to throw an error, the throw below error.

            console.error("🚀 ~ file: appUser-service.ts:123 ~ CreateOne: ~ error.message:", error.message)
            throw new Error(`Failed to create appUser: ${error.message}`);
        }
    },

    updateOne: async (dataUpdateOne: AppUserUpdateRequestType): Promise<ApiResponseType | null> => {
        console.log("🚀 ~ file: appUser-service.ts:129 ~ updateOne: ~ dataUpdateOne:", dataUpdateOne)

        if (!dataUpdateOne.dataId.id) {
            console.warn("🚀 ~ file: appUser-service.ts:132 ~ updateOne: ~ dataUpdateOne.dataId.id:", dataUpdateOne.dataId.id)

            return {
                isSuccess: false,
                data: null,
                message: 'ID is required to update the appUser.',
                errors: [
                    {
                        statusCode: 400,
                        status: 'BadRequest',
                        description: 'The ID is required for this request.'
                    }
                ]
            };
        }

        console.log("🚀 ~ file: appUser-service.ts:148 ~ updateOne: ~ ${endpoint}/${dataUpdateOne.dataId.id}:", `${endpoint}/${dataUpdateOne.dataId.id}`)

        try {
            const res = await api.put(`${endpoint}/${dataUpdateOne.dataId.id}`, dataUpdateOne.data);

            console.log("🚀 ~ file: appUser-service.ts:155 ~ updateOne: ~ res.data:", res.data)

            // Validate API response by schema
            const validatedResponse = apiResponseSchema.safeParse(res.data);
            if (!validatedResponse.success) {
                console.warn("🚀 ~ file: appUser-service.ts:158 ~ updateOne: ~ validatedResponse.error:", validatedResponse.error)
                throw new Error('Invalid API response structure: ' + validatedResponse.error);
            }

            return res.data as ApiResponseType;
        } catch (error: any) {
            console.error("🚀 ~ file: appUser-service.ts:164 ~ updateOne: ~ error:", error)
            console.error("🚀 ~ file: appUser-service.ts:165 ~ updateOne: ~ ApiResponse error:", error.response?.data)

            const errorData = error.response?.data as ApiResponseType;
            console.error("🚀 ~ file: appUser-service.ts:168 ~ updateOne: ~ errorData:", errorData)
            getFormattedError(errorData); // This method failed to throw an error, the throw below error.

            console.error("🚀 ~ file: appUser-service.ts:171 ~ updateOne: ~ error.message:", error.message)
            throw new Error(`Failed to update appUser: ${error.message}`);
        }
    },

    deleteOne: async (dataDeleteOne: AppUserDeleteRequestType): Promise<ApiResponseType | null> => {
        console.log("🚀 ~ file: appUser-service.ts:177 ~ deleteOne: ~ dataDeleteOne:", dataDeleteOne)

        if (!dataDeleteOne.dataId.id) {
            console.warn("🚀 ~ file: appUser-service.ts:180 ~ deleteOne: ~ dataDeleteOne.dataId.id:", dataDeleteOne.dataId.id)

            return {
                isSuccess: false,
                data: null,
                message: 'ID is required to delete the appUser.',
                errors: [
                    {
                        statusCode: 400,
                        status: 'BadRequest',
                        description: 'The ID is required for this request.'
                    }
                ]
            };
        }

        console.log("🚀 ~ file: appUser-service.ts:26 ~ deleteOne: ~ ${endpoint}/${dataDeleteOne.dataId.id}:", `${endpoint}/${dataDeleteOne.dataId.id}`)

        try {
            const res = await api.delete(`${endpoint}/${dataDeleteOne.dataId.id}`);

            console.log("🚀 ~ file: appUser-service.ts:201 ~ deleteOne: ~ res.data:", res.data)

            // Validate API response by schema
            const validatedResponse = apiResponseSchema.safeParse(res.data);
            if (!validatedResponse.success) {
                console.warn("🚀 ~ file: appUser-service.ts:206 ~ deleteOne: ~ validatedResponse.error:", validatedResponse.error)
                throw new Error('Invalid API response structure: ' + validatedResponse.error);
            }

            return res.data as ApiResponseType;
        } catch (error: any) {
            console.error("🚀 ~ file: appUser-service.ts:212 ~ deleteOne: ~ error:", error)
            console.error("🚀 ~ file: appUser-service.ts:213 ~ deleteOne: ~ ApiResponse error:", error.response?.data)

            const errorData = error.response?.data as ApiResponseType;
            console.error("🚀 ~ file: appUser-service.ts:216 ~ deleteOne: ~ errorData:", errorData)
            getFormattedError(errorData); // This method failed to throw an error, the throw below error.

            console.error("🚀 ~ file: appUser-service.ts:219 ~ deleteOne: ~ error.message:", error.message)
            throw new Error(`Failed to delete appUser: ${error.message}`);
        }
    },

    login: async (dataLogin: LoginRequestType): Promise<ApiResponseType | null> => {
        console.log("🚀 ~ file: appuser-service.ts:225 ~ login: ~ dataLogin:", dataLogin)

        if (!dataLogin.userName || !dataLogin.password) {
            console.log("🚀 ~ file: appuser-service.ts:228 ~ login: ~ dataLogin.userName:", dataLogin.userName)
            console.log("🚀 ~ file: appuser-service.ts:229 ~ login: ~ dataLogin.password:", dataLogin.password)

            return {
                isSuccess: false,
                data: null,
                message: 'Invalid username or password.',
                errors: [
                    {
                        statusCode: 400,
                        status: 'BadRequest',
                        description: 'Login failed. Please provide valid credentials.'
                    }
                ]
            };
        }

        console.log("🚀 ~ file: appUser-service.ts:245 ~ login: ~ ${endpoint}/login:", `${endpoint}/login`)

        try {
            // const res = await api.post(
            //     `${endpoint}/login`,
            //     dataLogin,
            //     {
            //         withCredentials: true, // Ensure credentials are sent
            //         headers: {
            //             'Content-Type': 'application/json'
            //         }
            //     }
            // ); 

            const res = await api.post(`${endpoint}/login`, dataLogin);

            console.log("🚀 ~ file: appuser-service.ts:250 ~ login: ~ res.data:", res.data)

            // Validate API response by schema
            const validatedResponse = apiResponseSchema.safeParse(res.data);
            if (!validatedResponse.success) {
                console.warn("🚀 ~ file: appUser-service.ts:255 ~ login: ~ validatedResponse.error:", validatedResponse.error)
                throw new Error('Invalid API response structure: ' + validatedResponse.error);
            }

            return res.data as ApiResponseType;
        } catch (error: any) {
            console.error("🚀 ~ file: appUser-service.ts:261 ~ login: ~ error:", error)
            console.error("🚀 ~ file: appUser-service.ts:262 ~ login: ~ ApiResponse error:", error.response?.data)

            const errorData = error.response?.data as ApiResponseType;
            console.error("🚀 ~ file: appUser-service.ts:265 ~ login: ~ errorData:", errorData)
            getFormattedError(errorData); // This method failed to throw an error, the throw below error.

            console.error("🚀 ~ file: appUser-service.ts:268 ~ login: ~ error.message:", error.message)
            throw new Error(`Failed to get appUser: ${error.message}`);
        }
    },
};
