import { useState } from "react";
import type { SidebarProfilType } from "../../types/sidebar/sidebar-profil-type";
import type { SidebarNavigationType } from "../../types/sidebar/sidebar-navigation-type";
import { ChevronDown } from "lucide-react";

export function SidebarProfilUI({ item, elements }: { item: SidebarProfilType; elements?: SidebarNavigationType[] }) {
    const [isOpen, setIsOpen] = useState(false);

    const togglePopup = () => {
        setIsOpen(!isOpen);
    };

    return (
        <div className="relative w-full border border-gray-200 rounded-xl">
            <div
                className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer"
                onClick={togglePopup}
            >
                <div className="w-10 h-10 rounded-full bg-gray-300 flex-shrink-0 overflow-hidden">
                    {item.avatar ? (
                        <img
                            src={item.avatar}
                            alt={item.name}
                            className="w-full h-full object-cover"
                        />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center bg-blue-500 text-white font-semibold">
                            {item.name.charAt(0).toUpperCase()}
                        </div>
                    )}
                </div>

                <div className="flex-1 min-w-0">
                    <h1 className="text-sm font-semibold text-gray-800 truncate">
                        {item.name}
                    </h1>
                    {item.information && (
                        <p className="text-xs text-gray-500 truncate">
                            {item.information}
                        </p>
                    )}
                </div>

                {elements && elements.length > 0 && (
                    <ChevronDown
                        className={`w-4 h-4 text-gray-400 transition-transform duration-200 flex-shrink-0 ${
                            isOpen ? "rotate-180" : ""
                        }`}
                    />
                )}
            </div>

            {elements && elements.length > 0 && isOpen && (
                <div className="absolute bottom-full left-0 right-0 mb-2 bg-white rounded-xl shadow-lg border border-gray-200 py-1 z-50">
                    {elements.map((navItem, index) => (
                        <a
                            key={index}
                            href={navItem.link}
                            className="flex items-center gap-2 px-4 py-2.5 text-sm text-black hover:bg-gray-100 transition-colors"
                            style={{ color: navItem.color || "currentColor" }}
                        >
                            {navItem.icon && (
                                <span className="flex-shrink-0"><navItem.icon className="w-4 h-4"/></span>
                            )}
                            <span>{navItem.title}</span>
                        </a>
                    ))}
                </div>
            )}

            {isOpen && (
                <div
                    className="fixed inset-0 z-40"
                    onClick={() => setIsOpen(false)}
                />
            )}
        </div>
    );
}