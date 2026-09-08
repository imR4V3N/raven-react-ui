export interface InputColorType {
    label?: string;
    name?: string;
    value?: string;
    textSize?: string;
    isRequired?: boolean;
    onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
    id?: string;
    disabled?: boolean;
    className?: string;
    error?: string;
    defaultColor?: string;
    showHex?: boolean;
    showRgb?: boolean;
    presets?: string[];
    width?: string;
    height?: string;
}