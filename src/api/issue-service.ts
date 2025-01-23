import { api } from '.';
import { IssueFindOneRequestType, IssueCreateRequestType, IssueUpdateRequestType, IssueDeleteRequestType } from '@/schemas/issueSchema';
import { FilterType, ApiResponseType, apiResponseSchema } from '@/schemas/commonSchema';
import { getUrlQueryParams, getFormattedError } from '@/lib/app-utils';

const endpoint = '/issues';

export default {
    find: async (filters: FilterType): Promise<ApiResponseType | null> => {
        console.log("🚀 ~ file: issue-service.ts:10 ~ Find: ~ filters:", filters)

        // Get URL query parameters from Browser URL
        const urlQueryParams = getUrlQueryParams(filters);

        console.log("🚀 ~ file: issue-service.ts:15 ~ find: ~ urlQueryParams:", urlQueryParams)
        console.log("🚀 ~ file: issue-service.ts:16 ~ find: ~ ${endpoint}?${urlQueryParams}:", `${endpoint}?${urlQueryParams}`)

        try {
            const res = await api.get(`${endpoint}?${urlQueryParams}`);

            console.log("🚀 ~ file: issue-service.ts:21 ~ find: ~ res.data:", res.data)

            // Validate API response by schema
            const validatedResponse = apiResponseSchema.safeParse(res.data);
            if (!validatedResponse.success) {
                console.warn("🚀 ~ file: issue-service.ts:26 ~ find: ~ validatedResponse.error:", validatedResponse.error)
                throw new Error('Invalid API response structure: ' + validatedResponse.error);
            }

            return res.data as ApiResponseType;
        } catch (error: any) {
            console.error("🚀 ~ file: issue-service.ts:32 ~ find: ~ error:", error)
            console.error("🚀 ~ file: issue-service.ts:33 ~ find: ~ ApiResponse error:", error.response?.data)

            const errorData = error.response?.data as ApiResponseType;
            console.error("🚀 ~ file: issue-service.ts:36 ~ find: ~ errorData:", errorData)
            getFormattedError(errorData); // This method failed to throw an error, the throw below error.

            console.error("🚀 ~ file: issue-service.ts:39 ~ find: ~ error.message:", error.message)
            throw new Error(`Failed to retrieve issue: ${error.message}`);
        }
    },

    findOne: async (dataFindOne: IssueFindOneRequestType): Promise<ApiResponseType | null> => {
        console.log("🚀 ~ file: issue-service.ts:45 ~ findOne: ~ id:", dataFindOne)

        if (!dataFindOne.dataId.id) {
            console.warn("🚀 ~ file: issue-service.ts:48 ~ findOne: ~ dataFindOne.dataId.id:", dataFindOne.dataId.id)

            return {
                isSuccess: false,
                data: null,
                message: 'ID is required to fetch the issue.',
                errors: [
                    {
                        statusCode: 400,
                        status: 'BadRequest',
                        description: 'The ID is required for this request.'
                    }
                ]
            };
        }

        console.log("🚀 ~ file: issue-service.ts:64 ~ findOne: ~ ${endpoint}/${dataFindOne.dataId.id}:", `${endpoint}/${dataFindOne.dataId.id}`)

        try {
            const res = await api.get(`${endpoint}/${dataFindOne.dataId.id}`);

            console.log("🚀 ~ file: issue-service.ts:69 ~ findOne: ~ res.data:", res.data)

            // Validate API response by schema
            const validatedResponse = apiResponseSchema.safeParse(res.data);
            if (!validatedResponse.success) {
                console.warn("🚀 ~ file: issue-service.ts:74 ~ findOne: ~ validatedResponse.error:", validatedResponse.error)
                throw new Error('Invalid API response structure: ' + validatedResponse.error);
            }

            return res.data as ApiResponseType;
        } catch (error: any) {
            console.error("🚀 ~ file: issue-service.ts:80 ~ findOne: ~ error:", error)
            console.error("🚀 ~ file: issue-service.ts:81 ~ findOne: ~ ApiResponse error:", error.response?.data)

            const errorData = error.response?.data as ApiResponseType;
            console.error("🚀 ~ file: issue-service.ts:84 ~ findOne: ~ errorData:", errorData)
            getFormattedError(errorData); // This method failed to throw an error, the throw below error.

            console.error("🚀 ~ file: issue-service.ts:87 ~ findOne: ~ error.message:", error.message)
            throw new Error(`Failed to get issue: ${error.message}`);
        }
    },

    createOne: async (dataCreateOne: IssueCreateRequestType): Promise<ApiResponseType | null> => {
        console.log("🚀 ~ file: issue-service.ts:93 ~ createOne: ~ dataCreateOne:", dataCreateOne)
        console.log("🚀 ~ file: issue-service.ts:94 ~ createOne: ~ endpoint:", endpoint)

        try {
            const res = await api.post(endpoint, dataCreateOne);

            console.log("🚀 ~ file: issue-service.ts:99 ~ createOne: ~ res.data:", res.data)

            // Validate API response by schema
            const validatedResponse = apiResponseSchema.safeParse(res.data);
            if (!validatedResponse.success) {
                console.warn("🚀 ~ file: issue-service.ts:104 ~ createOne: ~ validatedResponse.error:", validatedResponse.error)
                throw new Error('Invalid API response structure: ' + validatedResponse.error);
            }

            return res.data as ApiResponseType;
        } catch (error: any) {
            console.error("🚀 ~ file: issue-service.ts:119 ~ CreateOne: ~ error:", error)
            console.error("🚀 ~ file: issue-service.ts:111 ~ CreateOne: ~ ApiResponse error:", error.response?.data)

            const errorData = error.response?.data as ApiResponseType;
            console.error("🚀 ~ file: issue-service.114 ~ CreateOne: ~ errorData:", errorData)
            getFormattedError(errorData); // This method failed to throw an error, the throw below error.

            console.error("🚀 ~ file: issue-service.ts:117 ~ CreateOne: ~ error.message:", error.message)
            throw new Error(`Failed to create issue: ${error.message}`);
        }
    },

    updateOne: async (dataUpdateOne: IssueUpdateRequestType): Promise<ApiResponseType | null> => {
        console.log("🚀 ~ file: issue-service.ts:123 ~ updateOne: ~ dataUpdateOne:", dataUpdateOne)

        if (!dataUpdateOne.dataId.id) {
            console.warn("🚀 ~ file: issue-service.ts:126 ~ updateOne: ~ dataUpdateOne.dataId.id:", dataUpdateOne.dataId.id)

            return {
                isSuccess: false,
                data: null,
                message: 'ID is required to update the issue.',
                errors: [
                    {
                        statusCode: 400,
                        status: 'BadRequest',
                        description: 'The ID is required for this request.'
                    }
                ]
            };
        }

        console.log("🚀 ~ file: issue-service.ts:142 ~ updateOne: ~ ${endpoint}/${dataUpdateOne.dataId.id}:", `${endpoint}/${dataUpdateOne.dataId.id}`)

        try {
            const res = await api.put(`${endpoint}/${dataUpdateOne.dataId.id}`, dataUpdateOne.data);

            console.log("🚀 ~ file: issue-service.ts:147 ~ updateOne: ~ res.data:", res.data)

            // Validate API response by schema
            const validatedResponse = apiResponseSchema.safeParse(res.data);
            if (!validatedResponse.success) {
                console.warn("🚀 ~ file: issue-service.ts:152 ~ updateOne: ~ validatedResponse.error:", validatedResponse.error)
                throw new Error('Invalid API response structure: ' + validatedResponse.error);
            }

            return res.data as ApiResponseType;
        } catch (error: any) {
            console.error("🚀 ~ file: issue-service.ts:158 ~ updateOne: ~ error:", error)
            console.error("🚀 ~ file: issue-service.ts:159 ~ updateOne: ~ ApiResponse error:", error.response?.data)

            const errorData = error.response?.data as ApiResponseType;
            console.error("🚀 ~ file: issue-service.ts:168 ~ updateOne: ~ errorData:", errorData)
            getFormattedError(errorData); // This method failed to throw an error, the throw below error.

            console.error("🚀 ~ file: issue-service.ts:165 ~ updateOne: ~ error.message:", error.message)
            throw new Error(`Failed to update issue: ${error.message}`);
        }
    },

    deleteOne: async (dataDeleteOne: IssueDeleteRequestType): Promise<ApiResponseType | null> => {
        console.log("🚀 ~ file: issue-service.ts:177 ~ deleteOne: ~ dataDeleteOne:", dataDeleteOne)

        if (!dataDeleteOne.dataId.id) {
            console.warn("🚀 ~ file: issue-service.ts:174 ~ deleteOne: ~ dataDeleteOne.dataId.id:", dataDeleteOne.dataId.id)

            return {
                isSuccess: false,
                data: null,
                message: 'ID is required to delete the issue.',
                errors: [
                    {
                        statusCode: 400,
                        status: 'BadRequest',
                        description: 'The ID is required for this request.'
                    }
                ]
            };
        }

        console.log("🚀 ~ file: issue-service.ts:190 ~ deleteOne: ~ ${endpoint}/${dataDeleteOne.dataId.id}:", `${endpoint}/${dataDeleteOne.dataId.id}`)

        try {
            const res = await api.delete(`${endpoint}/${dataDeleteOne.dataId.id}`);

            console.log("🚀 ~ file: issue-service.ts:195 ~ deleteOne: ~ res.data:", res.data)

            // Validate API response by schema
            const validatedResponse = apiResponseSchema.safeParse(res.data);
            if (!validatedResponse.success) {
                console.warn("🚀 ~ file: issue-service.ts:200 ~ deleteOne: ~ validatedResponse.error:", validatedResponse.error)
                throw new Error('Invalid API response structure: ' + validatedResponse.error);
            }

            return res.data as ApiResponseType;
        } catch (error: any) {
            console.error("🚀 ~ file: issue-service.ts:206 ~ deleteOne: ~ error:", error)
            console.error("🚀 ~ file: issue-service.ts:207 ~ deleteOne: ~ ApiResponse error:", error.response?.data)

            const errorData = error.response?.data as ApiResponseType;
            console.error("🚀 ~ file: issue-service.ts:210 ~ deleteOne: ~ errorData:", errorData)
            getFormattedError(errorData); // This method failed to throw an error, the throw below error.

            console.error("🚀 ~ file: issue-service.ts:213 ~ deleteOne: ~ error.message:", error.message)
            throw new Error(`Failed to delete issue: ${error.message}`);
        }
    },
};
