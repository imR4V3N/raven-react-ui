export interface InputCheckType {
    label?: string;
    name?: string;
    value?: string | string[];
    type: 'checkbox' | 'radio';
    textSize?: string;
    isRequired?: boolean;
    onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
    id?: string;
    disabled?: boolean;
    className?: string;
    error?: string;
    checked?: boolean;
    defaultChecked?: boolean;
    options?: {
        label: string;
        value: string;
    }[];
    direction?: 'horizontal' | 'vertical';
}