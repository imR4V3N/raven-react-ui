export interface InputFileType {
    label?: string;
    name?: string;
    value?: string | File[];
    type?: 'simple' | 'multiple';
    format?: string[];
    textSize?: string;
    width?: string;
    height?: string;
    isRequired?: boolean;
    onChange?: (e: React.ChangeEvent<HTMLInputElement> | any) => void;
    id?: string;
    disabled?: boolean;
    className?: string;
    error?: string;
    min?: number;
    max?: number;
}