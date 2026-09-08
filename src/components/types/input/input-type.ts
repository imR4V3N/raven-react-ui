export interface InputType {
    label?: string;
    name?: string;
    value?: string;
    placeholder?: string;
    type: 'text' | 'email' | 'password' | 'number' | 'tel' | 'url' | 'search';
    width?: string;
    height?: string;
    textSize?: string;
    isRequired?: boolean;
    minLength?: number;
    maxLength?: number;
    onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
    id?: string;
    disabled?: boolean;
    className?: string;
    error?: string;
}