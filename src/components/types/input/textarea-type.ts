export interface TextareaType {
    name?: string;
    value?: string;
    label?: string;
    placeholder?: string;
    isRequired?: boolean;
    width?: string;
    height?: string;
    textSize?: string;
    onChange?: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
    id?: string;
    disabled?: boolean;
    className?: string;
    error?: string;
    maxLength?: number;
    minLength?: number;
    rows?: number;
    cols?: number;
    autoResize?: boolean;
    resize?: 'none' | 'vertical' | 'horizontal' | 'both';
    maxHeight?: string;
}