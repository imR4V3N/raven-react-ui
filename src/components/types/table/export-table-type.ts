export type ExportFormat = 'csv' | 'excel' | 'pdf' | 'xml' | 'json';
export type ExportScope = 'all' | 'current' | 'specific';

export interface ExportOptions {
    filename?: string;
    dateFormat?: string;
    delimiter?: string;
}

export interface ExportTableType {
    isOpen: boolean;
    onClose: () => void;
    onExport: (format: ExportFormat, scope: ExportScope, columns: string[], specificPage?: number) => void;
    columns: { key: string; title: string }[];
    totalRows: number;
    currentPageRows: number;
    totalPages: number;
}