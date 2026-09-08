import { useState, useMemo } from "react";
import { ChevronUp, ChevronDown } from "lucide-react";
import type {DataTableType} from "../../types/table/data-table-type.ts";
import { TablePagination } from "./table-pagination";
import {HeaderElement} from "@/components/ui/header/header-element.tsx";
import type {ExportFormat, ExportScope} from "@/components/types/table/export-table-type.ts";
import {ExportTable} from "@/components/ui/table/export-table.tsx";
import {generateExportFile} from "@/components/services/file/export.ts";

export function DataTable({
                              columns,
                              data,
                              rowsPerPageOptions = [5, 10, 25, 50],
                              defaultRowsPerPage = 5,
                              header,
                              textSize
                          }: DataTableType) {
    const [currentPage, setCurrentPage] = useState(1);
    const [rowsPerPage, setRowsPerPage] = useState(defaultRowsPerPage);
    const [sortConfig, setSortConfig] = useState<{ key: string; direction: 'asc' | 'desc' } | null>(null);

    // Sort data
    const sortedData = useMemo(() => {
        if (!sortConfig) return data;

        return [...data].sort((a, b) => {
            const aValue = a[sortConfig.key];
            const bValue = b[sortConfig.key];

            if (aValue === bValue) return 0;

            // Handle numeric values
            if (typeof aValue === 'number' && typeof bValue === 'number') {
                return sortConfig.direction === 'asc' ? aValue - bValue : bValue - aValue;
            }

            // Handle string values
            const aStr = String(aValue).toLowerCase();
            const bStr = String(bValue).toLowerCase();

            if (sortConfig.direction === 'asc') {
                return aStr.localeCompare(bStr);
            } else {
                return bStr.localeCompare(aStr);
            }
        });
    }, [data, sortConfig]);

    // Paginate data
    const paginatedData = useMemo(() => {
        const startIndex = (currentPage - 1) * rowsPerPage;
        const endIndex = startIndex + rowsPerPage;
        return sortedData.slice(startIndex, endIndex);
    }, [sortedData, currentPage, rowsPerPage]);

    const totalPages = Math.ceil(sortedData.length / rowsPerPage);

    // Handle sort
    const handleSort = (key: string) => {
        if (!columns.find(col => col.key === key)?.sortable) return;

        setSortConfig(prev => {
            if (prev?.key === key) {
                if (prev.direction === 'asc') {
                    return { key, direction: 'desc' };
                }
                return null;
            }
            return { key, direction: 'asc' };
        });
    };

    // Handle page change
    const goToPage = (page: number) => {
        setCurrentPage(Math.max(1, Math.min(page, totalPages)));
    };

    // Handle rows per page change
    const handleRowsPerPageChange = (rows: number) => {
        setRowsPerPage(rows);
        setCurrentPage(1);
    };

    const getSortIcon = (key: string) => {
        if (!sortConfig || sortConfig.key !== key) {
            return <ChevronUp className="w-3.5 h-3.5 text-gray-300 opacity-0 group-hover:opacity-100 transition-opacity" />;
        }
        return sortConfig.direction === 'asc'
            ? <ChevronUp className="w-3.5 h-3.5 text-gray-600" />
            : <ChevronDown className="w-3.5 h-3.5 text-gray-600" />;
    };

    const [isExportModalOpen, setIsExportModalOpen] = useState(false);

    const handleExport = (
        format: ExportFormat,
        scope: ExportScope,
        selectedColumns: string[],
        specificPage?: number
    ) => {
        // Données à exporter
        let dataToExport = sortedData;

        if (scope === 'current') {
            const startIndex = (currentPage - 1) * rowsPerPage;
            const endIndex = startIndex + rowsPerPage;
            dataToExport = sortedData.slice(startIndex, endIndex);
        } else if (scope === 'specific' && specificPage) {
            const startIndex = (specificPage - 1) * rowsPerPage;
            const endIndex = startIndex + rowsPerPage;
            dataToExport = sortedData.slice(startIndex, endIndex);
        }

        // Filtrer les colonnes sélectionnées
        const exportData = dataToExport.map(row => {
            const filteredRow: Record<string, any> = {};
            selectedColumns.forEach(colKey => {
                filteredRow[colKey] = row[colKey];
            });
            return filteredRow;
        });

        // Générer le fichier selon le format
        generateExportFile(exportData, format, selectedColumns, {
            filename: `export_${new Date().toISOString().slice(0, 10)}`,
            delimiter: ';',
        });
    };


    return (
        <div className="w-full bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            {header && (
                <HeaderElement header={header} handleClick={() => setIsExportModalOpen(true)} />
            )}

            {/* Table */}
            <div className="overflow-x-auto">
                <table className={`w-full`}>
                    <thead>
                    <tr className="border-b border-gray-200 bg-gray-50/50">
                        {columns.map((column) => (
                            <th
                                key={column.key}
                                className={`
                                        px-4 py-3 text-left ${textSize || 'text-xs'} font-semibold text-gray-500 uppercase tracking-wider
                                        ${column.sortable ? 'cursor-pointer group hover:text-gray-700' : ''}
                                        transition-colors duration-200
                                    `}
                                onClick={() => column.sortable && handleSort(column.key)}
                            >
                                <div className="flex items-center gap-1.5">
                                    <span>{column.title}</span>
                                    {column.sortable && getSortIcon(column.key)}
                                </div>
                            </th>
                        ))}
                    </tr>
                    </thead>
                    <tbody>
                    {paginatedData.length > 0 ? (
                        paginatedData.map((row, rowIndex) => (
                            <tr
                                key={rowIndex}
                                className={`
                                        border-b border-gray-100 last:border-0
                                        hover:bg-gray-50/50 transition-colors duration-150
                                    `}
                            >
                                {columns.map((column) => (
                                    <td
                                        key={column.key}
                                        className={`px-4 py-3 ${textSize || 'text-xs'} text-gray-700 whitespace-nowrap`}
                                    >
                                        {column.cell
                                            ? column.cell({ row: { original: row } })
                                            : row[column.key]
                                        }
                                    </td>
                                ))}
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td
                                colSpan={columns.length}
                                className={`px-4 py-8 text-center ${textSize || 'text-xs'} text-gray-500`}
                            >
                                Aucune donnée disponible
                            </td>
                        </tr>
                    )}
                    </tbody>
                </table>
            </div>

            {/* Pagination */}
            <TablePagination
                currentPage={currentPage}
                totalPages={totalPages}
                rowsPerPage={rowsPerPage}
                totalRows={sortedData.length}
                rowsPerPageOptions={rowsPerPageOptions}
                onPageChange={goToPage}
                onRowsPerPageChange={handleRowsPerPageChange}
            />

            {/* Export Table */}
            {header && (
                <ExportTable
                    isOpen={isExportModalOpen}
                    onClose={() => setIsExportModalOpen(false)}
                    onExport={handleExport}
                    columns={columns}
                    totalRows={sortedData.length}
                    currentPageRows={paginatedData.length}
                    totalPages={totalPages}
                />
            )}
        </div>
    );
}