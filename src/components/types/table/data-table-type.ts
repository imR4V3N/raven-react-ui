import type {ColumnType} from "./column-type";
import type {HeaderElementType} from "@/components/types/header/header-element-type.ts";

export interface DataTableType {
    columns: ColumnType[];
    data: any[];
    rowsPerPageOptions?: number[];
    defaultRowsPerPage?: number;
    header?: HeaderElementType;
    textSize?: string;
}