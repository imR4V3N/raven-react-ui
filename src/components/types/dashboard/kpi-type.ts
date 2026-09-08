// types/kpi-type.ts
export interface KpiType {
    title?: string;
    value?: number;
    description?: string;
    icon?: any;
    unit?: string;
    change?: number;
    changeType?: 'increase' | 'decrease' | 'neutral';
    subtitle?: string;
    className?: string;
    width?: string;
    height?: string;
}