export interface ColumnType<T = any> {
    key: string;
    title: string;
    sortable?: boolean;
    cell?: (props: { row: { original: T } }) => React.ReactNode;
}