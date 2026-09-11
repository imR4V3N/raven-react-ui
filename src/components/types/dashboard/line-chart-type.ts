export interface LineChartDataPoint {
    label: string;
    value: number;
}

export interface LineChartDataSet {
    name: string;
    data: LineChartDataPoint[];
    color?: string;
}

export interface LineChartType {
    title?: string;
    subtitle?: string;
    data: LineChartDataPoint[] | LineChartDataSet[];
    type?: 'line' | 'area';
    height?: number;
    width?: string;
    showGrid?: boolean;
    showLegend?: boolean;
    showValues?: boolean;
    showTooltip?: boolean;
    showXAxis?: boolean;
    showYAxis?: boolean;
    showDots?: boolean;
    animated?: boolean;
    smooth?: boolean;
    curved?: boolean;
    colors?: string[];
    valueFormatter?: (value: number) => string;
    className?: string;
    exportable?: boolean;
}