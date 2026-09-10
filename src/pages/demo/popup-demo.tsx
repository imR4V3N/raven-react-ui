import {FileText, HelpCircle, Home, LogOut, Menu, Settings, User, Users} from "lucide-react";
import type {SidebarNavigationType} from "@/components/types/sidebar/sidebar-navigation-type.ts";
import {Popup} from "@/components/ui/pop/popup.tsx";

export function PopupDemo() {
    const navigation: SidebarNavigationType[] = [
        {
            title: 'Dashboard',
            link: '/dashboard',
            icon: Home,
            color: 'text-blue-500'
        },
        {
            title: 'Utilisateurs',
            link: '/users',
            icon: Users,
            color: 'text-green-500',
            children: [
                {
                    title: 'Liste des utilisateurs',
                    link: '/users/list',
                    icon: User
                },
                {
                    title: 'Rôles et permissions',
                    link: '/users/roles',
                    icon: Settings
                }
            ]
        },
        {
            title: 'Documents',
            link: '/documents',
            icon: FileText,
            color: 'text-orange-500'
        },
        {
            title: 'Aide',
            link: '/help',
            icon: HelpCircle,
            color: 'text-purple-500'
        },
        {
            title: 'Déconnexion',
            link: '/logout',
            icon: LogOut,
            color: 'text-red-500'
        }
    ];

    const handleNavigate = (item: SidebarNavigationType) => {
        console.log('Navigation vers:', item.title, item.link);
        // Navigation logic...
    };

    return(
        <div className="p-8 w-full flex items-center justify-center">
            <Popup
                title="Navigation"
                button={{
                    text: 'Menu',
                    type: 'button',
                    state: 'normal',
                    icon: Menu,
                    bgColor: 'bg-black',
                    textColor: 'text-white',
                    textSize: 'text-sm'
                }}
                navigation={navigation}
                direction="up-right"
                onNavigate={handleNavigate}
            />
        </div>
    )
}