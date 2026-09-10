export interface BarChartDataItem {
    label: string;
    value: number;
    color?: string;
}

export interface BarChartDataSet {
    name: string;
    data: BarChartDataItem[];
    color?: string;
}

export interface BarChartType {
    title?: string;
    subtitle?: string;
    data: BarChartDataItem[] | BarChartDataSet[];
    type?: 'simple' | 'grouped' | 'stacked';
    direction?: 'vertical' | 'horizontal';
    height?: number;
    width?: number | string;
    showGrid?: boolean;
    showLegend?: boolean;
    showValues?: boolean;
    showTooltip?: boolean;
    showXAxis?: boolean;
    showYAxis?: boolean;
    animated?: boolean;
    colors?: string[];
    valueFormatter?: (value: number) => string;
    className?: string;
    exportable?: boolean;
}