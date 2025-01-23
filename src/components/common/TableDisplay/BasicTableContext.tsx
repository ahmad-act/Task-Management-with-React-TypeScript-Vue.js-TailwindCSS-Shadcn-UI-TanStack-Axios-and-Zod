import React, { createContext, useContext } from 'react';

// Define the BasicTableContext interface
interface BasicTableContextType {
    reactTable: any;
    filters: any;
    setFilters: (newFilters: any) => void;
    tableData: { totalPages: number };
    tableColumns: any[];
}

// Create the context with a default value of null
const BasicTableContext = createContext<BasicTableContextType | null>(null);

// Hook to use the BasicTableContext
export const useBasicTable = () => {
    const context = useContext(BasicTableContext);
    if (!context) {
        throw new Error('useBasicTable must be used within a BasicTableProvider');
    }
    return context;
};

// Provider component
export const BasicTableProvider: React.FC<{
    value: BasicTableContextType;
    children: React.ReactNode;
}> = ({ value, children }) => {
    return <BasicTableContext.Provider value={value}>{children}</BasicTableContext.Provider>;
};
