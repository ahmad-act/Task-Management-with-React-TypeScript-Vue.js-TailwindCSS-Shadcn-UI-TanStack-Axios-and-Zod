import { FilterType } from '@/schemas/commonSchema';
import { useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';

export function useQueryParams(filters: FilterType) {
    const [searchParams, setSearchParams] = useSearchParams();

    useEffect(() => {
        const updatedSearchParams = new URLSearchParams(searchParams);

        // Update searchTerm
        if (filters.searchTerm) {
            updatedSearchParams.set('searchTerm', filters.searchTerm);
        } else {
            updatedSearchParams.delete('searchTerm');
        }

        // Update pagination
        if (filters.page !== undefined) {
            updatedSearchParams.set('page', String(filters.page));
        }
        if (filters.pageSize !== undefined) {
            updatedSearchParams.set('pageSize', String(filters.pageSize));
        }

        // Update sorting
        if (filters.sortColumn) {
            updatedSearchParams.set('sortColumn', filters.sortColumn);
        }
        if (filters.sortOrder) {
            updatedSearchParams.set('sortOrder', filters.sortOrder);
        }

        // Update the URL
        setSearchParams(updatedSearchParams);
    }, [filters, searchParams, setSearchParams]); // Dependencies ensure it updates when filters change
}

