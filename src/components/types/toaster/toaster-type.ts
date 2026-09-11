export interface ToasterType{
    type?: 'default' | 'success' | 'error' | 'info' | 'warning';
    title?: string;
    message?: string;
    position?: 'top-left' | 'top-center' | 'top-right' | 'bottom-left' | 'bottom-center' | 'bottom-right';
    delay?: number;
    action?: ToasterAction[];
}

export interface ToasterAction {
    label: string;
    onClick: () => void;
}

export interface ToastItem extends ToasterType {
    id: string;
    createdAt: number;
}