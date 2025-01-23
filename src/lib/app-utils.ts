import { ApiResponseType, FilterType } from "@/schemas/commonSchema";
import { useLocation } from "react-router-dom";

export const defaultSearchConfig = {
    searchTerm: '',
    page: 1,
    pageSize: 10,
    sortColumn: 'name',
    sortOrder: 'asc',
};

export function getUrlQueryParams(filters: FilterType) {
    const params = new URLSearchParams();

    // Construct query parameters
    if (filters.searchTerm) params.append('searchTerm', filters.searchTerm);
    if (filters.page !== undefined) params.append('page', String(filters.page));
    if (filters.pageSize !== undefined) params.append('pageSize', String(filters.pageSize));
    if (filters.sortColumn) params.append('sortColumn', filters.sortColumn);
    if (filters.sortOrder) params.append('sortOrder', filters.sortOrder);

    return params.toString();
}

export function getQueryKey(endpoint: string, uniqueValue?: string) {
    if (uniqueValue) {
        return [endpoint, uniqueValue]
    }

    return [endpoint]
}

export function getQueryKeyWithUrlQueryParams(endpoint: string) {
    const location = useLocation();
    const searchParams = new URLSearchParams(location.search);

    // Access individual query parameters
    const searchTerm = searchParams.get("searchTerm") ?? "";
    const page = searchParams.get("page");
    const pageSize = searchParams.get("pageSize");
    const sortColumn = searchParams.get("sortColumn");
    const sortOrder = searchParams.get("sortOrder");  // Corrected: should be "sortOrder" instead of "pageSize"

    // Create a unique query key by concatenating the query parameters
    const uniqueQueryKey = searchTerm + page + pageSize + sortColumn + sortOrder;

    // Log the generated query key for debugging
    console.log("🚀 ~ uniqueQueryKey:", uniqueQueryKey);

    // Return the current query key using the provided queryKey function (assuming queryKey is defined elsewhere in your code)
    return getQueryKey(endpoint, uniqueQueryKey);  // Make sure `queryKey` is imported or defined correctly
};

export function getFormattedError(errorData: ApiResponseType) {
    if (errorData) {

        // Check if there are multiple errors in the array
        const errorMessages = errorData.errors?.map((error) => error.description) ?? [];
        let errorString = '';

        // If there are multiple errors, create a string with commas and "and" before the last one
        if (errorMessages?.length > 1) {
            const lastError = errorMessages.pop(); // Remove the last error
            errorString = `${errorMessages.join(', ')} and ${lastError}`; // Join the rest with commas and append "and" before the last one
        } else if (errorMessages?.length === 1) {
            // If only one error, just return it
            errorString = errorMessages[0];
        } else {
            errorString = "Failed to create"; // Fallback message if no errors exist
        }

        console.log(errorString);

        // If there are errors, throw the first error message from the response
        if (errorData.errors && errorData.errors.length > 0) {
            throw new Error(errorData.errors[0].description);
        }
    }
}
