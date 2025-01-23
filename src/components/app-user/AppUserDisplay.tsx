import { AppUserForm } from './AppUserForm';
import { BasicTable } from '../common/TableDisplay/BasicTableDisplay';
import { SearchBoxAndAddButton } from '../common/BasicSearchBoxAndAddButton';
import { useAppUserDelete } from '@/features/appuser-management';
import { useState } from 'react';
import { toast } from '@/hooks/use-toast';

import { BasicConfirmationDialog } from '@/components/common/BasicConfirmationDialog';
import { BasicTableProvider } from '../common/TableDisplay/BasicTableContext';

interface AppUserDisplayProps {
    title: string;
    tableData: any;
    isPending: boolean;
    error: Error | null;
    currentSelectedOperation: any;
    setCurrentSelectedOperation: (selection: any) => void;
    currentSelectedData: any;
    setCurrentSelectedData: (selection: any) => void;
    filters: any;
    setFilters: (newFilters: any) => void;
    searchTerm: string;
    setSearchTerm: (term: string) => void;
    mapTableDataToDisplay: any[];
    reactTable: any;
    tableColumns: any[];
    openDialog: boolean;
    setOpenDialog: (open: boolean) => void;
}

export function AppUserDisplay({
    title,
    tableData,
    isPending,
    error,
    currentSelectedOperation,
    setCurrentSelectedOperation,
    currentSelectedData,
    setCurrentSelectedData,
    filters,
    setFilters,
    searchTerm,
    setSearchTerm,
    mapTableDataToDisplay,
    reactTable,
    tableColumns: tableColumns,
    openDialog,
    setOpenDialog,
}: AppUserDisplayProps) {
    const [successMessage, setSuccessMessage] = useState<string | null>(null);
    const [errorMessageState, setErrorMessage] = useState<string | null>(null);
    const [showFormModal, setShowFormModal] = useState(false);

    const { mutate: mutateDelete } = useAppUserDelete();

    const handleAlertButtonOperation = () => {
        setSuccessMessage(null);
        setErrorMessage(null);

        switch (currentSelectedOperation) {
            case 'edit':
                setShowFormModal(true);
                break;
            case 'delete':
                handleConfirmDelete();
                break;
            default:
                console.error('Unsupported operation:', currentSelectedOperation);
                break;
        }
    };

    const handleConfirmDelete = () => {
        if (currentSelectedData?.id) {
            mutateDelete(
                { dataId: { id: currentSelectedData.id } },
                {
                    onSuccess: () => {
                        setSuccessMessage(`${title} deleted successfully!`);
                        setErrorMessage(null);
                        setOpenDialog(false);

                        toast({
                            title: `${title} deleted successfully!`,
                        });
                    },
                    onError: (error: Error) => {
                        setErrorMessage(`Error deleting ${title.toLowerCase()} data: ${error.message}`);
                        setSuccessMessage(null);
                        setOpenDialog(false);
                    },
                }
            );
        }
    };

    const searchBoxAndAddButtonProps = {
        searchTerm,
        setSearchTerm,
        setFilters,
        setShowFormModal,
        setCurrentSelectedData,
    };

    const tableProps = {
        reactTable,
        filters,
        setFilters,
        tableData,
        tableColumns,
    };

    const dialogProps = {
        openDialog,
        setOpenDialog,
        operationType: currentSelectedOperation,
        entityName: title,
        itemName: currentSelectedData?.name || '',
        handleConfirm: handleAlertButtonOperation,
    };

    return (
        <div className="p-6">
            {showFormModal ? (
                <AppUserForm
                    title={title}
                    selectedData={currentSelectedData}
                    onCancel={() => {
                        setShowFormModal(false);
                        setCurrentSelectedOperation(undefined);
                        setCurrentSelectedData(undefined);
                    }}
                />
            ) : (
                <>
                    {/* Loading and Error States */}
                    {isPending && <p className="text-center text-blue-500">Loading {title.toLowerCase()} data...</p>}
                    {error && <p className="text-center text-red-500">Error loading {title.toLowerCase()} data: {error.message}</p>}

                    {/* Success and Error Messages */}
                    {successMessage && <p className="text-center text-green-500">{successMessage}</p>}
                    {errorMessageState && <p className="text-center text-red-500">{errorMessageState}</p>}

                    {/* Search Box & Add button */}
                    <SearchBoxAndAddButton value={searchBoxAndAddButtonProps} />

                    {/* Table Display */}
                    <BasicTableProvider value={tableProps}>
                        {mapTableDataToDisplay && mapTableDataToDisplay.length > 0 ? (
                            <BasicTable />
                        ) : (
                            <p className="text-center text-gray-500">No data available.</p>
                        )}
                    </BasicTableProvider>
                </>
            )}

            {/* Confirmation Dialog */}
            <BasicConfirmationDialog value={dialogProps} />
        </div>
    );
}
