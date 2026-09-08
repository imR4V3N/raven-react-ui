export interface SidebarNavigationType {
    title: string;
    link?: string;
    icon?: any;
    color?: string;
    children?: SidebarNavigationType[];
    onClick?: () => void;
}