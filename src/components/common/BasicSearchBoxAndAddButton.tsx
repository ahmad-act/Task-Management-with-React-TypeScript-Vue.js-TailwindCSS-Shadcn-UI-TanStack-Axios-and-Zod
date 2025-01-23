import React, { createContext, useContext } from 'react';
import { useTheme } from "@/components/theme/ThemeProvider";
import { Button } from '../ui/button';

// Define the context interface
interface SearchBoxContextType {
    searchTerm: string;
    setSearchTerm: (term: string) => void;
    setFilters: (newFilters: any) => void;
    setShowFormModal: (show: boolean) => void;
    setCurrentSelectedData: (selection: any) => void;
}

// Create the context with a default value of null
const SearchBoxContext = createContext<SearchBoxContextType | null>(null);

// Hook to use the context
export const useSearchBox = () => {
    const context = useContext(SearchBoxContext);
    if (!context) {
        throw new Error('useSearchBox must be used within a SearchBoxProvider');
    }
    return context;
};

// Simplified wrapper component
export const SearchBoxAndAddButton: React.FC<{
    value: SearchBoxContextType;
}> = ({ value }) => {
    return (
        <SearchBoxContext.Provider value={value}>
            <SearchAndButton />
        </SearchBoxContext.Provider>
    );
};

// Component to render the search box and add button
function SearchAndButton() {
    const { theme } = useTheme(); // Get the current theme
    const { searchTerm, setSearchTerm, setFilters, setShowFormModal, setCurrentSelectedData } = useSearchBox();

    // Define class names based on theme
    const inputThemeCss =
        theme === 'dark' ? 'bg-gray-800 text-white border-gray-700' : 'bg-white text-black border-gray-300';
    const buttonThemeCss = {
        search: theme === 'dark' ? 'bg-blue-700 text-white' : 'bg-blue-500 text-white',
        add: theme === 'dark' ? 'bg-green-700 text-white' : 'bg-green-500 text-white',
    };

    return (
        <div className="mb-6 text-center flex items-center space-x-2">
            {/* Search Input taking full width */}
            <div className="flex-1">
                <input
                    type="text"
                    placeholder="Search by name or description"
                    className={`w-full px-4 py-2 border rounded-md ${inputThemeCss}`}
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>

            {/* Search Button */}
            <Button
                className={`px-4 py-2 rounded-md ${buttonThemeCss.search}`}
                onClick={() => setFilters((prev: any) => ({ ...prev, page: 1, searchTerm: searchTerm }))}
            >
                Search
            </Button>

            {/* Add Button */}
            <Button
                className={`px-4 py-2 rounded-md ${buttonThemeCss.add}`}
                onClick={() => {
                    setCurrentSelectedData(undefined);
                    setShowFormModal(true); // Open New Workspace modal
                }}
            >
                Add
            </Button>
        </div>
    );
}
