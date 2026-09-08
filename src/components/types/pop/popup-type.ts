import type {ButtonType} from "@/components/types/button/button-type.ts";
import type {SidebarNavigationType} from "@/components/types/sidebar/sidebar-navigation-type.ts";

export interface PopupType {
    title?: string;
    button?: ButtonType;
    navigation?: SidebarNavigationType[];
    direction?: 'left' | 'right' | 'up' | 'down';
    isOpen?: boolean;
    onClose?: () => void;
    onNavigate?: (item: SidebarNavigationType) => void;
    className?: string;
}