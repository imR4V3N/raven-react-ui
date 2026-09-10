import type {ButtonType} from "@/components/types/button/button-type.ts";
import type {SidebarNavigationType} from "@/components/types/sidebar/sidebar-navigation-type.ts";

export interface PopupType {
    title?: string;
    button?: ButtonType;
    navigation?: SidebarNavigationType[];
    direction?: 'left-top' | 'left-bottom' | 'right-top' | 'right-bottom' | 'up-left' | 'up-right' | 'down-left' | 'down-right';
    isOpen?: boolean;
    onClose?: () => void;
    onNavigate?: (item: SidebarNavigationType) => void;
    className?: string;
}