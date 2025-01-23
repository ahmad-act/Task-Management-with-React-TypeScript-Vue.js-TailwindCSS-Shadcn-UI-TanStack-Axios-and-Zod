import React, { createContext, useContext } from 'react';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from '@/components/ui/alert-dialog';

// Define the context interface
interface ConfirmationDialogContextProps {
    openDialog: boolean;
    setOpenDialog: (open: boolean) => void;
    operationType: 'delete' | 'edit';
    entityName: string;
    itemName: string;
    handleConfirm: () => void;
}

// Create the context with a default value of undefined
const ConfirmationDialogContext = createContext<ConfirmationDialogContextProps | undefined>(undefined);

// Hook to use the context
export const useConfirmationDialog = () => {
    const context = useContext(ConfirmationDialogContext);
    if (!context) {
        throw new Error('useConfirmationDialog must be used within a ConfirmationDialogProvider');
    }
    return context;
};

// Simplified wrapper component
export const BasicConfirmationDialog: React.FC<{
    value: ConfirmationDialogContextProps;
}> = ({ value }) => {
    return (
        <ConfirmationDialogContext.Provider value={value}>
            <ConfirmationDialog />
        </ConfirmationDialogContext.Provider>
    );
};

// Component to render the confirmation dialog
function ConfirmationDialog() {
    const { openDialog, setOpenDialog, operationType, entityName, itemName, handleConfirm } = useConfirmationDialog();

    return (
        <AlertDialog open={openDialog} onOpenChange={setOpenDialog}>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>
                        {operationType === 'delete' ? 'Confirm Deletion' : 'Confirm Edit'}
                    </AlertDialogTitle>
                    <AlertDialogDescription>
                        {operationType === 'delete'
                            ? `Are you sure you want to delete this ${entityName.toLowerCase()} [${itemName}]? This action cannot be undone.`
                            : `Are you sure you want to edit this ${entityName.toLowerCase()} [${itemName}]?`}
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <div className="flex justify-end space-x-2">
                        <AlertDialogCancel onClick={() => setOpenDialog(false)}>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={handleConfirm}>Confirm</AlertDialogAction>
                    </div>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
}
