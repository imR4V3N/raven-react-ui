export interface TablePaginationType {
    currentPage: number;
    totalPages: number;
    rowsPerPage: number;
    totalRows: number;
    rowsPerPageOptions: number[];
    onPageChange: (page: number) => void;
    onRowsPerPageChange: (rows: number) => void;
}
