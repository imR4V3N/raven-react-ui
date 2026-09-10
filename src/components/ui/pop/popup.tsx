import { useState, useEffect, useRef } from 'react';
import { ChevronRight, ChevronDown } from 'lucide-react';
import type { PopupType } from '@/components/types/pop/popup-type.ts';
import type { SidebarNavigationType } from '@/components/types/sidebar/sidebar-navigation-type.ts';
import { ButtonUI } from '@/components/ui/button/button-ui.tsx';

export function Popup({
                          title,
                          button,
                          navigation,
                          direction = 'right-top',
                          isOpen: externalIsOpen,
                          onClose,
                          onNavigate,
                          className = ''
                      }: PopupType & {
    isOpen?: boolean;
    onClose?: () => void;
    onNavigate?: (item: SidebarNavigationType) => void;
    className?: string;
}) {
    const [internalIsOpen, setInternalIsOpen] = useState(false);
    const [selectedItem, setSelectedItem] = useState<SidebarNavigationType | null>(null);
    const [expandedItems, setExpandedItems] = useState<string[]>([]);
    const popupRef = useRef<HTMLDivElement>(null);

    const isOpen = externalIsOpen !== undefined ? externalIsOpen : internalIsOpen;

    // Fermer le popup en cliquant à l'extérieur
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (popupRef.current && !popupRef.current.contains(event.target as Node)) {
                if (externalIsOpen === undefined) {
                    setInternalIsOpen(false);
                }
                if (onClose) {
                    onClose();
                }
            }
        };

        if (isOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isOpen, externalIsOpen, onClose]);

    // Gérer l'ouverture/fermeture
    const togglePopup = () => {
        if (externalIsOpen === undefined) {
            setInternalIsOpen(!internalIsOpen);
        } else if (onClose) {
            onClose();
        }
    };

    // Gérer la sélection d'un élément
    const handleItemClick = (item: SidebarNavigationType, e: React.MouseEvent) => {
        e.stopPropagation();

        if (item.children && item.children.length > 0) {
            // Toggle expansion
            setExpandedItems(prev =>
                prev.includes(item.title)
                    ? prev.filter(t => t !== item.title)
                    : [...prev, item.title]
            );
        } else {
            setSelectedItem(item);
            if (onNavigate) {
                onNavigate(item);
            }
            // Fermer le popup après sélection
            if (externalIsOpen === undefined) {
                setInternalIsOpen(false);
            }
            if (onClose) {
                onClose();
            }
        }
    };

    // Rendre les positions du popup
    const getPositionClasses = () => {
        switch (direction) {
            case 'left-top':
                return 'right-full bottom-0 -translate-y-0 mr-2';
            case 'left-bottom':
                return 'right-full top-0 -translate-y-0 mr-2';
            case 'right-top':
                return 'left-full bottom-0 -translate-y-0 ml-2';
            case 'right-bottom':
                return 'left-full top-0 -translate-y-0 ml-2';
            case 'up-left':
                return 'bottom-full right-0 -translate-x-0 mb-2';
            case 'up-right':
                return 'bottom-full left-0 -translate-x-0 mb-2';
            case 'down-left':
                return 'top-full right-0 -translate-x-0 mt-2';
            case 'down-right':
                return 'top-full left-0 -translate-x-0 mt-2';
            default:
                return 'left-full top-0 -translate-y-0 ml-2';
        }
    };

    // Rendre le contenu de navigation
    const renderNavigationItems = (items: SidebarNavigationType[], level: number = 0) => {
        return items.map((item) => {
            const hasChildren = item.children && item.children.length > 0;
            const isExpanded = expandedItems.includes(item.title);
            const isSelected = selectedItem?.title === item.title;

            return (
                <div key={item.title} className="w-full">
                    <button
                        type="button"
                        onClick={(e) => handleItemClick(item, e)}
                        className={`
                            w-full flex items-center gap-3 px-3 py-2.5 rounded-lg
                            transition-all duration-200
                            ${isSelected
                            ? 'bg-black text-white'
                            : 'hover:bg-gray-100 text-gray-700'
                        }
                            ${item.color ? `hover:${item.color}` : ''}
                            text-sm font-medium
                            group
                            cursor-pointer
                        `}
                        style={isSelected ? { backgroundColor: item.color || '#000' } : {}}
                    >
                        {item.icon && (
                            <item.icon className={`
                                w-4 h-4 flex-shrink-0
                                ${isSelected ? 'text-white' : 'text-gray-500 group-hover:text-gray-700'}
                            `} />
                        )}
                        <span className="flex-1 text-left">{item.title}</span>
                        {hasChildren && (
                            <span className="text-gray-400">
                                {isExpanded ?
                                    <ChevronDown className="w-4 h-4" /> :
                                    <ChevronRight className="w-4 h-4" />
                                }
                            </span>
                        )}
                    </button>

                    {hasChildren && isExpanded && (
                        <div className="ml-4 mt-1 border-l-2 border-gray-200 pl-3">
                            {renderNavigationItems(item.children!, level + 1)}
                        </div>
                    )}
                </div>
            );
        });
    };

    return (
        <div className={`relative inline-block ${className}`} ref={popupRef}>
            {/* Bouton trigger */}
            {button && (
                <ButtonUI
                    {...button}
                    onClick={togglePopup}
                />
            )}

            {/* Popup */}
            {isOpen && navigation && (
                <div
                    className={`
                        absolute z-50 min-w-[280px] max-w-[360px]
                        bg-white rounded-xl shadow-2xl border border-gray-200
                        ${getPositionClasses()}
                        animate-fadeIn
                    `}
                >
                    {/* Header */}
                    {title && (
                        <div className="px-4 py-3 border-b border-gray-200">
                            <h3 className="text-sm font-semibold text-gray-900">
                                {title}
                            </h3>
                        </div>
                    )}

                    {/* Navigation */}
                    <div className="p-2 max-h-80 overflow-y-auto">
                        {renderNavigationItems(navigation)}
                    </div>

                    {/* Footer avec lien vers le bas */}
                    <div className="px-4 py-2 border-t border-gray-100">
                        <button
                            type="button"
                            onClick={() => {
                                if (externalIsOpen === undefined) {
                                    setInternalIsOpen(false);
                                }
                                if (onClose) {
                                    onClose();
                                }
                            }}
                            className="w-full text-xs text-gray-400 hover:text-red-600 text-center py-1 transition-colors cursor-pointer"
                        >
                            Fermer
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}