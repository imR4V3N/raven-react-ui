export interface InputOtpType {
    label?: string;
    name?: string;
    value?: string[];
    type?: "number" | "string";
    placeholder?: string;
    width?: string;
    height?: string;
    textSize?: string;
    isRequired?: boolean;
    length: number;
    onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
    id?: string;
    disabled?: boolean;
    className?: string;
    error?: string;
}