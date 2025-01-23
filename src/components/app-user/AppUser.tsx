import { useState, useMemo, useRef } from 'react';
import { FiEdit, FiTrash2 } from 'react-icons/fi';
import { useReactTable, getCoreRowModel, getPaginationRowModel, getSortedRowModel } from '@tanstack/react-table';
import { Button } from "../ui/button";

import { defaultSearchConfig } from "@/lib/app-utils";
import { FilterType } from "@/schemas/commonSchema";
import { AppUserFormDataType, AppUserListType } from "@/schemas/appUserSchema";

import { useQueryParams } from "@/features/common-management";
import { useAppUserFind } from "@/features/appuser-management";

import { AppUserDisplay } from "./AppUserDisplay";

export function AppUser() {
    const title = "App user"
    console.log("🚀🚀🚀🚀🚀🚀🚀🚀🚀🚀 ~ AppUser ~ 🚀🚀🚀🚀🚀🚀🚀🚀🚀🚀 title:", title)
    const [searchTerm, setSearchTerm] = useState('');
    const [filters, setFilters] = useState<FilterType>(defaultSearchConfig);

    const { isPending, data: responseData, error }: { isPending: boolean; data: AppUserListType; error: any } = useAppUserFind(filters);
    console.log("🚀 ~ file: AppUser.tsx:25 ~ AppUser ~ responseData:", responseData)
    const dataRef = useRef<AppUserListType>(responseData);

    const [openDialog, setOpenDialog] = useState(false); // State to control AlertDialog visibility
    const [currentSelectedOperation, setCurrentSelectedOperation] = useState<string | undefined>(undefined);
    const [currentSelectedData, setCurrentSelectedData] = useState<AppUserFormDataType | undefined>(undefined);

    // Update the URL query parameters
    useQueryParams(filters);

    // Function to handle edit & delete action, shows confirmation before actually editing or deleting
    function handleRowButtonOperation(operation: string,
        selectedData: AppUserFormDataType) {
        console.log("🚀 ~ file: AppUser.tsx:59 ~ AppUser ~ operation:", operation);
        console.log("🚀 ~ file: AppUser.tsx:63 ~ AppUser ~ selectedData:", selectedData);
        setCurrentSelectedOperation(operation);
        console.log("🚀 ~ file: AppUser.tsx:66 ~ AppUser ~ currentSelectedOperation:", currentSelectedOperation);

        setCurrentSelectedData(selectedData);
        console.log("🚀 ~ file: AppUser.tsx:67 ~ AppUser ~ currentSelectedData:", currentSelectedData);
        setOpenDialog(true); // Open the confirmation dialog
    }

    // Define columns for TanStack Table V8 to display data with Edit and Delete buttons
    const columns = useMemo(
        () => [
            {
                accessorKey: 'userName', // The key that refers to the data
                header: () => (
                    <div className="text-center font-bold w-full max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg xl:max-w-xl">Username</div>
                ),
                size: 50,
                minSize: 30,
                maxSize: 120,
                enableResizing: true,
                cell: ({ row }: any) => (
                    <div className="text-left py-3 px-6">{row.getValue('userName')}</div>
                ),
            },
            {
                accessorKey: 'email', // The key that refers to the data
                header: () => (
                    <div className="text-center font-bold w-full max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg xl:max-w-xl">Email</div>
                ),
                size: 200,
                minSize: 30,
                maxSize: 120,
                enableResizing: true,
                cell: ({ row }: any) => (
                    <div className="text-left py-3 px-6">{row.getValue('email')}</div>
                ),
            },
            {
                id: 'edit',
                header: () => (
                    <div className="text-center font-bold w-full">
                        Edit
                    </div>
                ),
                cell: ({ row }: any) => (
                    <div className="flex justify-center items-center w-full h-full w-[10px]">
                        <Button
                            className="bg-transparent text-blue-500 hover:bg-blue-100 hover:underline inline-flex items-center justify-center w-[16px] h-[16px] p-2 text-center border border-transparent"
                            onClick={() => handleRowButtonOperation('edit', row.original)
                            }
                        >
                            <FiEdit className="w-full h-full" />
                        </Button >
                    </div>
                ),
            },
            {
                id: 'delete',
                header: () => (
                    <div className="text-center font-bold w-full">
                        Delete
                    </div>
                ),
                cell: ({ row }: any) => (
                    <div className="flex justify-center items-center w-full h-full w-[10px]">
                        <Button
                            className="bg-transparent text-red-500 hover:bg-red-100 hover:underline inline-flex items-center justify-center w-[16px] h-[16px] p-2 text-center border border-transparent"
                            onClick={() => handleRowButtonOperation('delete', row.original)}
                        >
                            <FiTrash2 className="w-full h-full" />
                        </Button>
                    </div>
                ),
            },
        ],
        []
    );

    dataRef.current = responseData;
    console.log("🚀 ~ file: AppUser.tsx:213 ~ AppUser ~ responseData:", responseData)
    console.log("🚀 ~ file: AppUser.tsx:213 ~ AppUser ~ dataRef.current:", dataRef.current)

    //Mapping table data to the display table - ID, Name, Description, ...
    const mapTableDataToDisplay = useMemo(() => {
        return dataRef.current.items.map((item : any) => ({
            id: item.appUser?.id,
            userName: item.appUser?.userName,
            password: item.appUser?.password,
            email: item.appUser?.email,
        }));
    }, [dataRef.current]);

    const reactTable = useReactTable({
        data: mapTableDataToDisplay, // Data from the mapping
        columns, // Column definitions
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        getSortedRowModel: getSortedRowModel(),
        manualPagination: true, // Enable manual pagination
        pageCount: responseData.totalPages, // Total number of pages from server
        state: {
            pagination: {
                pageIndex: filters.page ?? 1 - 1, // Adjust for zero-based indexing
                pageSize: filters.pageSize ?? 10,
            },
        },
        onPaginationChange: (updaterOrValue) => {
            const newPaginationState =
                typeof updaterOrValue === 'function'
                    ? updaterOrValue({ pageIndex: filters.page ?? 1 - 1, pageSize: filters.pageSize ?? 10 }) // Adjust for zero-based indexing
                    : updaterOrValue;

            // Validate and update the pagination state
            setFilters((prev) => ({
                ...prev,
                page: (newPaginationState.pageIndex || 0) + 1, // Convert back to one-based indexing
                pageSize: newPaginationState.pageSize || 10,  // Default to 10 if undefined
            }));
        },
    });

    return (
        <AppUserDisplay
            title={title}
            tableData={dataRef.current}
            isPending={isPending}
            error={error}
            currentSelectedOperation={currentSelectedOperation}
            setCurrentSelectedOperation={setCurrentSelectedOperation}
            currentSelectedData={currentSelectedData}
            setCurrentSelectedData={setCurrentSelectedData}
            filters={filters}
            setFilters={setFilters}
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            mapTableDataToDisplay={mapTableDataToDisplay}
            reactTable={reactTable}
            tableColumns={columns}
            openDialog={openDialog}
            setOpenDialog={setOpenDialog}
        />
    );
}
