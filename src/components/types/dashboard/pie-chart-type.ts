export interface PieChartDataItem {
    label: string;
    value: number;
    color?: string;
}

export interface PieChartType {
    title?: string;
    subtitle?: string;
    data: PieChartDataItem[];
    type?: 'pie' | 'doughnut';
    size?: number;
    width?: string;
    thickness?: number;
    startAngle?: number;
    endAngle?: number;
    padAngle?: number;
    showLegend?: boolean;
    showValues?: boolean;
    showPercentages?: boolean;
    showTooltip?: boolean;
    showCenterLabel?: boolean;
    centerLabel?: string;
    centerValue?: string;
    animated?: boolean;
    colors?: string[];
    valueFormatter?: (value: number) => string;
    legendPosition?: 'right' | 'bottom' | 'left' | 'top';
    className?: string;
    exportable?: boolean;
}