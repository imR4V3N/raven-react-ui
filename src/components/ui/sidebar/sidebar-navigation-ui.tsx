import { useState } from "react";
import { useLocation, Link } from "react-router-dom";
import type { SidebarNavigationType } from "../../types/sidebar/sidebar-navigation-type";
import { ChevronRight } from "lucide-react";

const DEFAULT_COLOR = '#4B5563';

interface SidebarNavigationUIProps {
    elements: SidebarNavigationType[];
    depth?: number;
}

/**
 * Vérifie si un lien est actif
 * Gère les cas : correspondance exacte, sous-routes, et liens parents
 */
function isLinkActive(itemLink: string | undefined, currentPath: string): boolean {
    if (!itemLink) return false;

    // Nettoyer les trailing slashes
    const cleanLink = itemLink.replace(/\/$/, '') || '/';
    const cleanPath = currentPath.replace(/\/$/, '') || '/';

    // Correspondance exacte
    if (cleanLink === cleanPath) return true;

    // Sous-route (ex: /users actif pour /users/123)
    return cleanLink !== '/' && cleanPath.startsWith(cleanLink + '/');


}

/**
 * Vérifie si un élément ou l'un de ses descendants est actif
 */
function isItemActive(item: SidebarNavigationType, currentPath: string): boolean {
    // Vérifier le lien direct
    if (isLinkActive(item.link, currentPath)) return true;

    // Vérifier récursivement les enfants
    if (item.children && item.children.length > 0) {
        return item.children.some(child => isItemActive(child, currentPath));
    }

    return false;
}

/**
 * Vérifie si un enfant exact est actif (pas un parent)
 */
function hasActiveChild(item: SidebarNavigationType, currentPath: string): boolean {
    if (!item.children) return false;
    return item.children.some(child => isItemActive(child, currentPath));
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
    const location = useLocation();
    const [isOpen, setIsOpen] = useState(false);

    const hasChildren = item.children && item.children.length > 0;
    const shouldShowPopup = hasChildren && depth >= 2;

    const isActive = isLinkActive(item.link, location.pathname);
    const isParentActive = hasActiveChild(item, location.pathname);

    const shouldBeOpen = isOpen || isParentActive;

    const toggleOpen = () => {
        if (hasChildren) {
            setIsOpen(!isOpen);
        }
    };

    const paddingLeft = depth > 0 ? `${depth * 12 + 12}px` : "12px";

    const activeClasses = isActive
        ? 'bg-gray-900 text-white hover:bg-gray-800'
        : isParentActive
            ? 'text-gray-900 font-semibold hover:bg-gray-100'
            : depth === 0
                ? 'text-gray-700 hover:bg-gray-100'
                : 'text-gray-600 hover:bg-gray-50';

    const sharedClassName = `
        flex items-center gap-2 px-3 py-2.5 rounded-lg 
        text-sm font-medium transition-all duration-200
        ${activeClasses}
        ${hasChildren ? 'cursor-pointer' : ''}
        group
    `;

    const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
        if (hasChildren) {
            e.preventDefault();
            toggleOpen();
        }
        item.onClick?.();
    };

    const content = (
        <>
            {item.icon && (
                <span
                    className="flex-shrink-0"
                    style={{
                        color: isActive ? 'white' : (item.color || DEFAULT_COLOR)
                    }}
                >
                    <item.icon className="w-4 h-4" />
                </span>
            )}

            <span className="flex-1 truncate">{item.title}</span>

            {hasChildren && (
                <ChevronRight
                    className={`
                        w-4 h-4 flex-shrink-0 transition-transform duration-200
                        ${isActive ? 'text-white' : 'text-gray-400'}
                        ${shouldBeOpen ? 'rotate-90' : ''}
                    `}
                />
            )}
        </>
    );

    return (
        <li className="relative">
            <div className="relative">
                {item.link && !hasChildren ? (
                    <Link
                        to={item.link}
                        className={sharedClassName}
                        style={{ paddingLeft }}
                        onClick={handleClick}
                    >
                        {content}
                    </Link>
                ) : (
                    <a
                        href={item.link || '#'}
                        className={sharedClassName}
                        style={{ paddingLeft }}
                        onClick={handleClick}
                    >
                        {content}
                    </a>
                )}

                {hasChildren && shouldShowPopup && shouldBeOpen && (
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

            {hasChildren && !shouldShowPopup && shouldBeOpen && (
                <div className="mt-1">
                    <SidebarNavigationUI elements={item.children!} depth={depth + 1} />
                </div>
            )}
        </li>
    );
}

function PopupItem({ item, level }: { item: SidebarNavigationType; level: number }) {
    const location = useLocation();
    const [isOpen, setIsOpen] = useState(false);

    const hasChildren = item.children && item.children.length > 0;

    const isActive = isLinkActive(item.link, location.pathname);
    const isParentActive = hasActiveChild(item, location.pathname);
    const shouldBeOpen = isOpen || isParentActive;

    const toggleOpen = () => {
        if (hasChildren) {
            setIsOpen(!isOpen);
        }
    };

    const activeClasses = isActive
        ? 'bg-gray-900 text-white hover:bg-gray-800'
        : isParentActive
            ? 'text-gray-900 font-semibold hover:bg-gray-50'
            : 'text-gray-700 hover:bg-gray-50';

    return (
        <div>
            <a
                href={item.link || '#'}
                className={`
                    flex items-center gap-2 px-4 py-2 text-sm transition-colors 
                    ${activeClasses}
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
                    item.onClick?.();
                }}
            >
                {item.icon && (
                    <span
                        className="flex-shrink-0"
                        style={{
                            color: isActive ? 'white' : (item.color || DEFAULT_COLOR)
                        }}
                    >
                        <item.icon className="w-4 h-4" />
                    </span>
                )}
                <span className="flex-1 truncate">{item.title}</span>
                {hasChildren && (
                    <ChevronRight
                        className={`
                            w-3.5 h-3.5 flex-shrink-0 transition-transform duration-200
                            ${isActive ? 'text-white' : 'text-gray-400'}
                            ${shouldBeOpen ? 'rotate-90' : ''}
                        `}
                    />
                )}
            </a>

            {hasChildren && shouldBeOpen && (
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