export interface ButtonType {
    text?: string;
    icon?: any;
    type: "submit" | "reset" | "button";
    state: "normal" | "disabled" | "loading";
    loadingType?: 'spin' | 'dots' | 'pulse';
    loadingText?: string;
    bgColor?: string;
    textColor?: string;
    textSize?: string;
    width?: string;
    height?: string;
    hoverText?: string;
    hoverBg?: string;
    className?: string;
    onClick?: () => void;
}