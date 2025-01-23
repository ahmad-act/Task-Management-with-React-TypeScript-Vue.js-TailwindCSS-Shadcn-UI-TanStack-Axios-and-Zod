import { IssueForm } from './IssueForm';
import { BasicTable } from '../common/TableDisplay/BasicTableDisplay';
import { SearchBoxAndAddButton } from '../common/BasicSearchBoxAndAddButton';
import { BasicConfirmationDialog } from '../common/BasicConfirmationDialog';
import { useIssueDelete } from '@/features/issue-management';
import { useState } from 'react';
import { toast } from '@/hooks/use-toast';
import { BasicTableProvider } from '../common/TableDisplay/BasicTableContext';

interface IssueDisplayProps {
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

export function IssueDisplay({
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
    tableColumns,
    openDialog,
    setOpenDialog,
}: IssueDisplayProps) {
    const { mutate: mutateDelete, isError, message: errorMessage, data: dataDelete } = useIssueDelete();
    const [successMessage, setSuccessMessage] = useState<string | null>(null);
    const [errorMessageState, setErrorMessage] = useState<string | null>(null);

    const [showFormModal, setShowFormModal] = useState(false);

    const handleAlertButtonOperation = () => {
        setSuccessMessage(null);
        setErrorMessage(null);

        console.log("🚀 ~ file: IssueDisplay.tsx:59 ~ handleAlertButtonOperation ~ currentSelectedOperation:", currentSelectedOperation)

        switch (currentSelectedOperation) {
            case 'edit':
                console.log("Edit operation triggered");
                setShowFormModal(true);
                break;

            case 'delete':
                console.log("Delete operation triggered");
                handleConfirmDelete();
                break;

            default:
                console.error("Unsupported operation:", currentSelectedOperation);
                break;
        };
    };

    // Confirm delete action
    const handleConfirmDelete = () => {
        console.log("Deleting issue with ID:", currentSelectedData?.id);

        if (currentSelectedData?.id) {

            mutateDelete(
                {
                    dataId: { id: currentSelectedData.id },
                },
                {
                    onSuccess: () => {
                        setSuccessMessage(`${title} deleted successfully!`);
                        setErrorMessage(null); // Clear any previous error messages
                        setOpenDialog(false); // Close the confirmation dialog

                        toast({
                            title: `${title} deleted successfully!`,
                            //description: `${title} updated successfully!`,
                        })
                    },

                    onError: (error: Error) => {
                        setErrorMessage(`Error deleting ${title.toLowerCase()} data: ${error.message}`);
                        setSuccessMessage(null); // Clear any previous success messages
                        setOpenDialog(false); // Close the confirmation dialog
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
                <IssueForm
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

                    {/* Table Display - with Search box and Add button */}
                    <BasicTableProvider value={tableProps}>
                        {mapTableDataToDisplay && mapTableDataToDisplay.length > 0 ? (
                            <BasicTable />
                        ) : (
                            <p className="text-center text-gray-500">No data available.</p>
                        )}
                    </BasicTableProvider>
                </>
            )}

            {/* Confirmation Dialog for Modification & Deletion */}
            <BasicConfirmationDialog value={dialogProps} />
        </div>
    );
}
