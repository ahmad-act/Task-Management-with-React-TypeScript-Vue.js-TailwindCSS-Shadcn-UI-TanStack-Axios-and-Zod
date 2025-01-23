import { useState, useMemo, useRef } from 'react';
import { FiEdit, FiTrash2 } from 'react-icons/fi';
import { useReactTable, getCoreRowModel, getPaginationRowModel, getSortedRowModel } from '@tanstack/react-table';
import { Button } from "../ui/button";

import { defaultSearchConfig } from "@/lib/app-utils";
import { FilterType } from "@/schemas/commonSchema";
import { TaskFormDataSchema, TaskListType } from "@/schemas/taskSchema";

import { useQueryParams } from "@/features/common-management";
import { useTaskFind } from "@/features/task-management";

import { TaskDisplay } from "./TaskDisplay";
import { WorkspaceListType } from '@/schemas/workspaceSchema';
import { useWorkspaceFind } from '@/features/workspace-management';

export function Task() {
    const title = "Task"
    console.log("🚀🚀🚀🚀🚀🚀🚀🚀🚀🚀 ~ Task ~ 🚀🚀🚀🚀🚀🚀🚀🚀🚀🚀 title:", title)
    const [searchTerm, setSearchTerm] = useState('');
    const [filters, setFilters] = useState<FilterType>(defaultSearchConfig);

    const { isPending, data: responseData, error }: { isPending: boolean; data: TaskListType; error: any } = useTaskFind(filters);
    console.log("🚀 ~ file: Task.tsx:25 ~ Task ~ responseData:", responseData)
    const dataRef = useRef<TaskListType>(responseData);


    const { isPending:dsf, data: responseData1, error:sdf }: { isPending: boolean; data: WorkspaceListType; error: any } = useWorkspaceFind(filters);
    console.log("🚀 ~ file: Task.tsx:29 ~ Task ~ responseData1:", responseData1)
    console.log("🚀 ~ file: Task.tsx:29 ~ Task ~ dsf:", dsf)
    console.log("🚀 ~ file: Task.tsx:25 ~ Task ~ responseData:", responseData)
    const dataRef1 = useRef<WorkspaceListType>(responseData);
    console.log("🚀 ~ file: Task.tsx:31 ~ Task ~ dataRef1:", dataRef1)






    const [openDialog, setOpenDialog] = useState(false); // State to control AlertDialog visibility
    const [currentSelectedOperation, setCurrentSelectedOperation] = useState<string | undefined>(undefined);
    const [currentSelectedData, setCurrentSelectedData] = useState<TaskFormDataSchema | undefined>(undefined);

    // Update the URL query parameters
    useQueryParams(filters);

    // Function to handle edit & delete action, shows confirmation before actually editing or deleting
    function handleRowButtonOperation(operation: string,
        selectedData: TaskFormDataSchema) {
        console.log("🚀 ~ file: Task.tsx:59 ~ Task ~ operation:", operation);
        console.log("🚀 ~ file: Task.tsx:63 ~ Task ~ selectedData:", selectedData);
        setCurrentSelectedOperation(operation);
        console.log("🚀 ~ file: Task.tsx:66 ~ Task ~ currentSelectedOperation:", currentSelectedOperation);

        setCurrentSelectedData(selectedData);
        console.log("🚀 ~ file: Task.tsx:67 ~ Task ~ currentSelectedData:", currentSelectedData);
        setOpenDialog(true); // Open the confirmation dialog
    }

    // Define columns for TanStack Table V8 to display data with Edit and Delete buttons
    const columns = useMemo(
        () => [
            {
                accessorKey: 'name', // The key that refers to the data
                header: () => (
                    <div className="text-center font-bold w-full max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg xl:max-w-xl">Name</div>
                ),
                size: 50,
                minSize: 30,
                maxSize: 120,
                enableResizing: true,
                cell: ({ row }: any) => (
                    <div className="text-left py-3 px-6">{row.getValue('name')}</div>
                ),
            },
            {
                accessorKey: 'description', // The key that refers to the data
                header: () => (
                    <div className="text-center font-bold w-full max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg xl:max-w-xl">Description</div>
                ),
                size: 200,
                minSize: 30,
                maxSize: 120,
                enableResizing: true,
                cell: ({ row }: any) => (
                    <div className="text-left py-3 px-6">{row.getValue('description')}</div>
                ),
            },
            {
                accessorKey: 'status', // The key that refers to the data
                header: () => (
                    <div className="text-center font-bold w-full max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg xl:max-w-xl">Status</div>
                ),
                size: 200,
                minSize: 30,
                maxSize: 120,
                enableResizing: true,
                cell: ({ row }: any) => (
                    <div className="text-left py-3 px-6">{row.getValue('status')}</div>
                ),
            },            
            {
                accessorKey: 'project', // The key that refers to the data
                header: () => (
                    <div className="text-center font-bold w-full max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg xl:max-w-xl">Project</div>
                ),
                size: 200,
                minSize: 30,
                maxSize: 120,
                enableResizing: true,
                cell: ({ row }: any) => (
                    <div className="text-left py-3 px-6">{row.getValue('project')}</div>
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
    console.log("🚀 ~ file: Task.tsx:213 ~ Task ~ responseData:", responseData)
    console.log("🚀 ~ file: Task.tsx:213 ~ Task ~ dataRef.current:", dataRef.current)

    //Mapping table data to the display table - ID, Name, Description, ...
    const mapTableDataToDisplay = useMemo(() => {
        return dataRef.current.items.map((item) => ({
            id: item.id,
            name: item.name,
            description: item.description,
            status: item.status,
            projectId: item.projectId,
            project: item.project?.name
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
        <TaskDisplay
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
