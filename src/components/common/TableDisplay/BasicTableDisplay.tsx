import { flexRender } from '@tanstack/react-table';
import { Button } from '../../ui/button';
import { useState } from 'react'; // Import useState
import { useTheme } from "@/components/theme/ThemeProvider";
import { useBasicTable } from './BasicTableContext';
import { Table, TableBody, TableCell, TableFooter, TableHead, TableHeader, TableRow } from '@/components/ui/table';

export function BasicTable() {
    // Get context values
    const { reactTable, filters, setFilters, tableData, tableColumns } = useBasicTable();

    const { theme } = useTheme(); // Get the current theme
    const [selectedRow, setSelectedRow] = useState<string | null>(null); // Track selected row ID

    // Define dynamic classes based on the theme
    const tableThemeCss = theme === 'dark' ? 'bg-gray-700 text-white' : 'bg-white text-black';
    const headerThemeCss = theme === 'dark' ? 'bg-purple-900 text-white' : 'bg-purple-200 text-gray-700';

    // Function to determine the background color for each row, including selection highlight
    const rowThemeCss = (index: number, rowId: string, isHover: boolean) => {

        if (theme === 'dark') {
            if (rowId === selectedRow) {
                return 'bg-blue-700'; // Highlight selected row with a blue background and white text
            }

            if (isHover) {
                return 'bg-blue-700';
            }
            else {
                return index % 2 === 0 ? 'bg-gray-700' : 'bg-gray-800'; // Alternate row colors
            }
        }
        else {
            if (rowId === selectedRow) {
                return 'bg-blue-500'; // Highlight selected row with a blue background and white text
            }

            if (isHover) {
                return 'bg-blue-500';
            }
            else {
                return index % 2 === 0 ? 'bg-gray-100' : 'bg-gray-300'; // Alternate row colors
            }
        }
    };

    const buttonThemeCss = theme === 'dark'
        ? 'bg-gray-600 text-white hover:bg-gray-700'
        : 'bg-gray-400 text-black hover:bg-gray-500';


    // Function to handle row selection
    const handleRowSelect = (rowId: string) => {
        setSelectedRow(rowId === selectedRow ? null : rowId); // Deselect row if already selected
    };

    return (
        <div className={`overflow-x-auto rounded-lg shadow-lg min-w-[800px] ${tableThemeCss}`}>
            {/* Table Display */}
            <Table className="min-w-full table-auto">
                <TableHeader className={headerThemeCss}>
                    {reactTable.getHeaderGroups().map((headerGroup: any) => (
                        <TableRow key={headerGroup.id}>
                            {headerGroup.headers.map((header: any) => (
                                <TableHead
                                    key={header.id}
                                    className="py-4"
                                >
                                    {flexRender(header.column.columnDef.header, header.getContext())}
                                </TableHead>
                            ))}
                        </TableRow>
                    ))}
                </TableHeader>
                <TableBody>
                    {reactTable.getRowModel().rows && reactTable.getRowModel().rows.length > 0 ? (
                        reactTable.getRowModel().rows.map((row: any, index: any) => (
                            <TableRow
                                key={row.id}
                                className={`${rowThemeCss(index, row.id, false)} hover:${rowThemeCss(index, row.id, true)} transition-all`}
                                onClick={() => handleRowSelect(row.id)}
                            >
                                {row.getAllCells().map((cell: any) => (
                                    <TableCell key={cell.id}>
                                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                    </TableCell>
                                ))}
                            </TableRow>
                        ))
                    ) : (
                        <TableRow>
                            <TableCell colSpan={tableColumns.length} className="py-3 px-6 text-center text-gray-500">
                                No data available
                            </TableCell>
                        </TableRow>
                    )}
                </TableBody>
                <TableFooter>
                    <TableRow>
                        <TableCell colSpan={tableColumns.length}>
                            {/* Pagination Controls */}
                            <div className="flex justify-center items-center space-x-4 py-4">
                                <Button
                                    onClick={() => setFilters((prev: any) => ({ ...prev, page: 1 }))}
                                    disabled={filters.page === 1}
                                    className={buttonThemeCss}
                                >
                                    First Page
                                </Button>
                                <Button
                                    onClick={() => setFilters((prev: any) => ({ ...prev, page: Math.max(1, prev.page - 1) }))}
                                    disabled={filters.page === 1}
                                    className={buttonThemeCss}
                                >
                                    Previous
                                </Button>
                                <span className="text-center">
                                    Page {filters.page} of {tableData.totalPages}
                                </span>
                                <Button
                                    onClick={() => setFilters((prev: any) => ({
                                        ...prev,
                                        page: Math.min(tableData.totalPages, prev.page + 1),
                                    }))}
                                    disabled={filters.page === tableData.totalPages}
                                    className={buttonThemeCss}
                                >
                                    Next
                                </Button>
                                <Button
                                    onClick={() => setFilters((prev: any) => ({ ...prev, page: tableData.totalPages }))}
                                    disabled={filters.page === tableData.totalPages}
                                    className={buttonThemeCss}
                                >
                                    Last Page
                                </Button>
                            </div>
                        </TableCell>
                    </TableRow>
                </TableFooter>
            </Table>
        </div>
    );
}
