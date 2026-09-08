import { useState } from "react";
import type { SidebarNavigationType } from "../../types/sidebar/sidebar-navigation-type";
import { ChevronRight } from "lucide-react";

interface SidebarNavigationUIProps {
    elements: SidebarNavigationType[];
    depth?: number;
}

export function SidebarNavigationUI({ elements, depth = 0 }: SidebarNavigationUIProps) {
    return (
        <nav className="sidebar-navigation-ui w-full">
            <ul className="space-y-1">
                {elements.map((element, index) => (
                    <NavigationItem
                        key={index}
                        item={element}
                        depth={depth}
                    />
                ))}
            </ul>
        </nav>
    );
}

function NavigationItem({ item, depth }: { item: SidebarNavigationType; depth: number }) {
    const [isOpen, setIsOpen] = useState(false);
    const hasChildren = item.children && item.children.length > 0;
    const shouldShowPopup = hasChildren && depth >= 2;

    const toggleOpen = () => {
        if (hasChildren) {
            setIsOpen(!isOpen);
        }
    };

    const paddingLeft = depth > 0 ? `${depth * 12 + 12}px` : "12px";

    return (
        <li className="relative">
            <div className="relative">
                <a
                    href={item.link}
                    className={`
                        flex items-center gap-2 px-3 py-2.5 rounded-lg 
                        text-sm font-medium transition-all duration-200
                        ${depth === 0 ? 'text-gray-700 hover:bg-gray-100' : 'text-gray-600 hover:bg-gray-50'}
                        ${hasChildren ? 'cursor-pointer' : ''}
                        group
                    `}
                    style={{ paddingLeft }}
                    onClick={(e) => {
                        if (hasChildren) {
                            e.preventDefault();
                            toggleOpen();
                        }
                    }}
                >
                    {item.icon && (
                        <span className="flex-shrink-0" style={{ color: item.color || "currentColor" }}>
                            <item.icon className="w-4 h-4" />
                        </span>
                    )}

                    <span className="flex-1 truncate">{item.title}</span>

                    {hasChildren && (
                        <ChevronRight
                            className={`
                                w-4 h-4 flex-shrink-0 text-gray-400 transition-transform duration-200
                                ${isOpen ? 'rotate-90' : ''}
                            `}
                        />
                    )}
                </a>

                {hasChildren && shouldShowPopup && isOpen && (
                    <div className="absolute left-0 top-full mt-2 z-50 w-full md:left-0 md:top-full md:mt-2 md:min-w-[220px] md:w-auto">
                        <div className="bg-white rounded-lg shadow-lg border border-gray-200 py-2">
                            <div className="px-4 py-2 border-b border-gray-100">
                                <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
                                    {item.title}
                                </span>
                            </div>

                            <div className="py-1 overflow-y-auto max-h-[200px]">
                                {item.children!.map((child, idx) => (
                                    <PopupItem key={idx} item={child} level={0} />
                                ))}
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {hasChildren && !shouldShowPopup && isOpen && (
                <div className="mt-1">
                    <SidebarNavigationUI elements={item.children!} depth={depth + 1} />
                </div>
            )}
        </li>
    );
}

function PopupItem({ item, level }: { item: SidebarNavigationType; level: number }) {
    const [isOpen, setIsOpen] = useState(false);
    const hasChildren = item.children && item.children.length > 0;

    const toggleOpen = () => {
        if (hasChildren) {
            setIsOpen(!isOpen);
        }
    };

    return (
        <div>
            <a
                href={item.link}
                className={`
                    flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors 
                    ${hasChildren ? 'cursor-pointer' : ''}
                    ${level > 0 ? 'ml-4' : ''}
                `}
                style={{
                    paddingLeft: level > 0 ? `${level * 16 + 16}px` : "16px"
                }}
                onClick={(e) => {
                    if (hasChildren) {
                        e.preventDefault();
                        toggleOpen();
                    }
                }}
            >
                {item.icon && (
                    <span className="flex-shrink-0" style={{ color: item.color || "currentColor" }}>
                        <item.icon className="w-4 h-4" />
                    </span>
                )}
                <span className="flex-1 truncate">{item.title}</span>
                {hasChildren && (
                    <ChevronRight
                        className={`
                            w-3.5 h-3.5 flex-shrink-0 text-gray-400 transition-transform duration-200
                            ${isOpen ? 'rotate-90' : ''}
                        `}
                    />
                )}
            </a>

            {hasChildren && isOpen && (
                <div className="relative">
                    <div>
                        {item.children!.map((child, idx) => (
                            <PopupItem key={idx} item={child} level={level + 1} />
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}