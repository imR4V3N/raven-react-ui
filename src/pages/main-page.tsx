import {SidebarUI} from "../components/ui/sidebar/sidebar-ui";
import {useState} from "react";
import type {SidebarLogoType} from "../components/types/sidebar/sidebar-logo-type";
import type {SidebarNavigationType} from "../components/types/sidebar/sidebar-navigation-type";
import type {SidebarProfilType} from "../components/types/sidebar/sidebar-profil-type";
import {
    Table,
    BookOpenText,
    User,
    LogOut,
    LayoutDashboard,
    Radio,
    Zap, Archive, Vote, MessageSquare, Camera, MonitorX
} from "lucide-react";
import {Outlet} from "react-router-dom";

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
            title: "Erreur",
            link: "/",
            icon: MonitorX,
            color: "#4B5563"
        },
        {
            title: "Dashboard",
            link: "/dashboard",
            icon: LayoutDashboard,
            color: "#4B5563"
        },
        {
            title: "Formulaire",
            link: "/form",
            icon: BookOpenText,
            color: "#4B5563"
        },
        {
            title: "Tableau",
            link: "/table",
            icon: Table,
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
        }
    ]);

    const [profil] = useState<SidebarProfilType>({
        name: "Anne Marie",
        information: "Software Engineer",
        avatar: "/avatar.png"
    });

    return (
        <div className="flex w-screen h-screen relative">
            <SidebarUI logo={logo} navigation={navigation} profil={profil} profilNavigation={profilNavigation} />
            <main className="bg-gray-200 p-3 w-full h-screen relative flex flex-col overflow-y-scroll gap-3">
                <Outlet />
            </main>
        </div>
    )
}

export default MainPage