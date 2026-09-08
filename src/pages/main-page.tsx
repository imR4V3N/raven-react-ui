import {SidebarUI} from "../components/ui/sidebar/sidebar-ui";
import {useState} from "react";
import type {SidebarLogoType} from "../components/types/sidebar/sidebar-logo-type";
import type {SidebarNavigationType} from "../components/types/sidebar/sidebar-navigation-type";
import type {SidebarProfilType} from "../components/types/sidebar/sidebar-profil-type";
import {
    User,
    LogOut,
    LayoutDashboard,
    Users,
    FileText,
    Calendar,
    Megaphone,
    DollarSign,
    Radio,
    BarChart3, Info, ShoppingCart, Settings,
    Zap, Archive, Vote, MessageSquare, Camera
} from "lucide-react";
import {FormDemo} from "@/pages/demo/form-demo.tsx";
import {TableDemo} from "@/pages/demo/table-demo.tsx";

const MainPage = () => {
    const [logo] = useState<SidebarLogoType>({
        title: "Raven UI",
        logo: "/logo.png",
        link: "/"
    });

    const [profilNavigation] = useState<SidebarNavigationType[]>([
        {
            title: "Profile",
            link: "/",
            icon: User
        },
        {
            title: "Logout",
            link: "/",
            icon: LogOut,
            color: "red"
        }
    ]);

    const [navigation] = useState<SidebarNavigationType[]>([
        {
            title: "Dashboard",
            link: "/dashboard",
            icon: LayoutDashboard,
            color: "#4B5563"
        },
        {
            title: "Audience",
            link: "/audience",
            icon: Users,
            color: "#4B5563"
        },
        {
            title: "Posts",
            link: "/posts",
            icon: FileText,
            color: "#4B5563"
        },
        {
            title: "Schedules",
            link: "/schedules",
            icon: Calendar,
            color: "#4B5563"
        },
        {
            title: "Income",
            link: "/income",
            icon: DollarSign,
            color: "#4B5563"
        },
        {
            title: "Promote",
            link: "/promote",
            icon: Megaphone,
            color: "#4B5563"
        },
        {
            title: "Campaigns",
            link: "/campaigns",
            icon: Radio,
            color: "#4B5563",
            children: [
                {
                    title: "Active",
                    link: "/campaigns/active",
                    icon: Zap,
                    children: [
                        {
                            title: "Archived",
                            link: "/campaigns/active/archived",
                            icon: Archive,
                            children: [
                                {
                                    title: "Social Media",
                                    link: "/campaigns/active/archived/social",
                                    icon: Vote,
                                    children:[
                                        {
                                            title: "Facebook",
                                            link: "facebook.com",
                                            icon: MessageSquare,
                                            children:[
                                                {
                                                    title: "Page",
                                                    link: "facebook.com/page"
                                                }
                                            ]
                                        },
                                        {
                                            title: "Intagram",
                                            link: "instagram.com",
                                            icon: Camera,
                                            children:[
                                                {
                                                    title: "Page",
                                                    link: "instagram.com/page"
                                                },
                                                {
                                                    title: "Vlog",
                                                    link: "instagram.com/vlog",
                                                    children: [
                                                        {
                                                            title: "Weekend",
                                                            link: "",
                                                            children: [
                                                                {
                                                                    title: "Destination",
                                                                    link: ""
                                                                }
                                                            ]
                                                        }
                                                    ]
                                                }
                                            ]
                                        }
                                    ]
                                },
                                {
                                    title: "Email",
                                    link: "/campaigns/active/archived/email"
                                },
                                {
                                    title: "Push Notifications",
                                    link: "/campaigns/active/archived/push"
                                }
                            ]
                        }
                    ]
                }
            ]
        },
        {
            title: "Analytics",
            link: "/analytics",
            icon: BarChart3,
            color: "#4B5563",
            children: [
                {
                    title: "Informations générales",
                    link: "/analytics/general",
                    icon: Info
                },
                {
                    title: "Détails de la vente",
                    link: "/analytics/sales",
                    icon: ShoppingCart,
                    children: [
                        {
                            title: "Désignation",
                            link: "/analytics/sales/designation"
                        },
                        {
                            title: "Vente du 22/08/2026",
                            link: "/analytics/sales/date"
                        },
                        {
                            title: "Client *",
                            link: "/analytics/sales/client"
                        },
                        {
                            title: "Alice Martin · Paris",
                            link: "/analytics/sales/client-detail"
                        }
                    ]
                },
                {
                    title: "Options avancées",
                    link: "/analytics/advanced",
                    icon: Settings,
                    children: [
                        {
                            title: "Paramètres additionnels",
                            link: "/analytics/advanced/settings"
                        }
                    ]
                }
            ]
        }
    ]);

    const [profil] = useState<SidebarProfilType>({
        name: "John Doe",
        information: "Software Engineer",
        avatar: "/avatar.png"
    });

    return (
        <div className="flex w-screen h-screen relative">
            <SidebarUI logo={logo} navigation={navigation} profil={profil} profilNavigation={profilNavigation} />
            <main className="bg-gray-200 p-3 w-full h-screen relative flex flex-col overflow-y-scroll">
                <FormDemo />
                <TableDemo />
            </main>
        </div>
    )
}

export default MainPage