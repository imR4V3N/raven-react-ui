export interface InputDateType {
    label?: string;
    name?: string;
    value?: string;
    type: 'date' | 'datetime-local' | 'month' | 'time';
    width?: string;
    height?: string;
    textSize?: string;
    isRequired?: boolean;
    onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
    id?: string;
    disabled?: boolean;
    className?: string;
    error?: string;
    min?: string;
    max?: string;
    step?: number;
}