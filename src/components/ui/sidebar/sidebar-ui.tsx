import { SidebarLogoUI } from "./sidebar-logo-ui";
import { SidebarProfilUI } from "./sidebar-profil-ui";
import { SidebarNavigationUI } from "./sidebar-navigation-ui";
import type { SidebarLogoType } from "../../types/sidebar/sidebar-logo-type";
import type { SidebarNavigationType } from "../../types/sidebar/sidebar-navigation-type";
import type { SidebarProfilType } from "../../types/sidebar/sidebar-profil-type";
import { useState } from "react";
import {Menu, X} from "lucide-react";
import {ButtonUI} from "../button/button-ui";

export function SidebarUI({
                              logo,
                              navigation,
                              profil,
                              profilNavigation
                          }: {
    logo: SidebarLogoType;
    navigation: SidebarNavigationType[];
    profil: SidebarProfilType;
    profilNavigation?: SidebarNavigationType[]
}) {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <>
            <div className="md:hidden p-3 absolute z-50">
                <ButtonUI type="button" state="normal" icon={Menu} textColor="text-gray-700" bgColor="bg-gray-100" onClick={() => setIsOpen(true)} />
            </div>

            <div className="sidebar-ui hidden md:flex w-[300px] h-screen bg-white border-r border-gray-200 flex-col">
                <div className="flex-shrink-0 px-4 py-5 border-b border-gray-100">
                    <SidebarLogoUI element={logo} />
                </div>

                <div className="flex-1 overflow-y-auto px-3 py-2">
                    <SidebarNavigationUI elements={navigation} />
                </div>

                <div className="flex-shrink-0 border-t border-gray-200 px-3 py-3">
                    <SidebarProfilUI item={profil} elements={profilNavigation} />
                </div>
            </div>

            {isOpen && (
                <div className="fixed inset-0 z-50 flex">
                    <div className="fixed inset-0 bg-black/40" onClick={() => setIsOpen(false)} />

                    <aside className="relative w-[260px] max-w-full h-full bg-white border-r border-gray-200 flex flex-col">
                        <div className="flex items-center justify-between px-4 py-5 border-b border-gray-100">
                            <SidebarLogoUI element={logo} />
                            <button
                                type="button"
                                aria-label="Close sidebar"
                                className="p-2 rounded-md text-gray-600"
                                onClick={() => setIsOpen(false)}
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <div className="flex-1 overflow-y-auto overflow-x-hidden px-3 py-2">
                            <SidebarNavigationUI elements={navigation} />
                        </div>

                        <div className="mt-auto flex-shrink-0 border-t border-gray-200 px-3 py-3">
                            <SidebarProfilUI item={profil} elements={profilNavigation} />
                        </div>
                    </aside>
                </div>
            )}
        </>
    );
}