import { ChevronLeft, ChevronRight } from "lucide-react";
import type {TablePaginationType} from "@/components/types/table/table-pagination-type.ts";


export function TablePagination({
    currentPage,
    totalPages,
    rowsPerPage,
    totalRows,
    rowsPerPageOptions,
    onPageChange,
    onRowsPerPageChange,
}: TablePaginationType) {
    return (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 px-4 py-3 border-t border-gray-200 bg-gray-50/30">
            {/* Rows per page */}
            <div className="flex items-center gap-2 text-sm text-gray-600">
                <span>Lignes par page</span>
                <select
                    value={rowsPerPage}
                    onChange={(e) => onRowsPerPageChange(Number(e.target.value))}
                    className="px-2 py-1 border border-gray-300 rounded-md text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent cursor-pointer"
                >
                    {rowsPerPageOptions.map(option => (
                        <option key={option} value={option}>
                            {option}
                        </option>
                    ))}
                </select>
            </div>

            {/* Page info and controls */}
            <div className="flex items-center gap-3 text-sm text-gray-600">
                <span>
                    {totalRows > 0 ? (
                        `${(currentPage - 1) * rowsPerPage + 1}-${Math.min(currentPage * rowsPerPage, totalRows)} sur ${totalRows}`
                    ) : (
                        '0 sur 0'
                    )}
                </span>

                <div className="flex items-center gap-1">
                    {/* Previous button */}
                    <button
                        onClick={() => onPageChange(currentPage - 1)}
                        disabled={currentPage === 1}
                        className={`
                            p-1 rounded-md transition-colors duration-200
                            ${currentPage === 1
                            ? 'text-gray-300 cursor-not-allowed'
                            : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                        }
                        `}
                    >
                        <ChevronLeft className="w-4 h-4" />
                    </button>

                    {/* Page numbers */}
                    <div className="flex items-center gap-0.5">
                        {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                            let pageNum;
                            if (totalPages <= 5) {
                                pageNum = i + 1;
                            } else if (currentPage <= 3) {
                                pageNum = i + 1;
                            } else if (currentPage >= totalPages - 2) {
                                pageNum = totalPages - 4 + i;
                            } else {
                                pageNum = currentPage - 2 + i;
                            }

                            return (
                                <button
                                    key={pageNum}
                                    onClick={() => onPageChange(pageNum)}
                                    className={`
                                        min-w-[28px] h-7 px-1.5 rounded-md text-sm font-medium
                                        transition-colors duration-200
                                        ${currentPage === pageNum
                                        ? 'bg-black text-white'
                                        : 'text-gray-600 hover:bg-gray-100'
                                    }
                                        `}
                                >
                                    {pageNum}
                                </button>
                            );
                        })}
                    </div>

                    {/* Next button */}
                    <button
                        onClick={() => onPageChange(currentPage + 1)}
                        disabled={currentPage === totalPages || totalPages === 0}
                        className={`
                            p-1 rounded-md transition-colors duration-200
                            ${currentPage === totalPages || totalPages === 0
                            ? 'text-gray-300 cursor-not-allowed'
                            : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                        }
                        `}
                    >
                        <ChevronRight className="w-4 h-4" />
                    </button>
                </div>
            </div>
        </div>
    );
}