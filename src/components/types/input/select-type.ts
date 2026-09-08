export interface SelectType {
    label?: string;
    name?: string;
    options?: {
        label: string;
        value: string;
    }[];
    value?: string | string[];
    defaultValue?: string | string[];
    type?: 'simple' | 'multiple';
    placeholder?: string;
    width?: string;
    height?: string;
    textSize?: string;
    isRequired?: boolean;
    onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
    id?: string;
    disabled?: boolean;
    className?: string;
    error?: string;
}