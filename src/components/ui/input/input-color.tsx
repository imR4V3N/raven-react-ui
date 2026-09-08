import { useState, useRef, useEffect } from 'react';
import { Check } from 'lucide-react';
import type { InputColorType } from "@/components/types/input/input-color-type.ts";

export function InputColor(item: InputColorType) {

    const [color, setColor] = useState(item.value || item.defaultColor || '#000000');
    const [isOpen, setIsOpen] = useState(false);
    const [customColor, setCustomColor] = useState(item.value || item.defaultColor || '#000000');
    const pickerRef = useRef<HTMLDivElement>(null);

    const currentColor = item.value !== undefined ? item.value : color;

    // Fermer le picker en cliquant à l'extérieur
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (pickerRef.current && !pickerRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    // Convertir hex en rgb
    const hexToRgb = (hex: string): { r: number; g: number; b: number } | null => {
        const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
        return result ? {
            r: parseInt(result[1], 16),
            g: parseInt(result[2], 16),
            b: parseInt(result[3], 16)
        } : null;
    };

    // Obtenir la luminosité d'une couleur
    const getBrightness = (hex: string): number => {
        const rgb = hexToRgb(hex);
        if (!rgb) return 0;
        return (rgb.r * 299 + rgb.g * 587 + rgb.b * 114) / 1000;
    };

    // Déterminer si le texte doit être blanc ou noir
    const getContrastColor = (hex: string): string => {
        return getBrightness(hex) > 128 ? '#000000' : '#FFFFFF';
    };

    const handleColorChange = (newColor: string) => {
        if (item.value === undefined) {
            setColor(newColor);
        }
        if (item.onChange) {
            item.onChange({
                target: {
                    name: item.name || '',
                    value: newColor
                }
            } as React.ChangeEvent<HTMLInputElement>);
        }
        setCustomColor(newColor);
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newColor = e.target.value;
        setCustomColor(newColor);
        if (isValidHex(newColor)) {
            handleColorChange(newColor);
        }
    };

    const isValidHex = (hex: string): boolean => {
        return /^#?([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/.test(hex);
    };

    const getDisplayColor = () => {
        return currentColor && isValidHex(currentColor) ? currentColor : '#000000';
    };

    const rgb = hexToRgb(getDisplayColor());

    return (
        <div className="flex flex-col w-fit">
            {item.label && (
                <label className={`font-caption text-caption text-on-surface-variant font-semibold block mb-1 ${item.textSize || 'text-xs'}`}>
                    {item.label} {item.isRequired && '*'}
                </label>
            )}

            <div className="relative" ref={pickerRef}>
                {/* Input caché pour la valeur */}
                <input
                    type="hidden"
                    name={item.name}
                    id={item.id}
                    value={currentColor}
                />

                <div className="flex items-center gap-3">
                    {/* Bouton de couleur */}
                    <button
                        type="button"
                        onClick={() => !item.disabled && setIsOpen(!isOpen)}
                        disabled={item.disabled}
                        className={`
                            relative w-12 h-12 rounded-lg border-2 
                            ${item.error ? 'border-red-500' : 'border-gray-300'}
                            ${item.disabled ? 'opacity-50 cursor-not-allowed' : 'hover:border-gray-400 cursor-pointer'}
                            transition-all duration-200
                            flex-shrink-0
                            ${item.className}
                            ${item.width || 'w-10'} ${item.height || 'h-10'}
                        `}
                        style={{ backgroundColor: getDisplayColor() }}
                    >
                    </button>

                    {/* Affichage des valeurs */}
                    <div className="flex-1 min-w-0">
                        {item.showHex && (
                            <div className="flex items-center gap-2">
                                <span className={`text-xs text-on-surface-variant ${item.textSize || 'text-xs'}`}>Hex:</span>
                                <input
                                    type="text"
                                    value={customColor}
                                    onChange={handleInputChange}
                                    onBlur={() => {
                                        if (isValidHex(customColor)) {
                                            handleColorChange(customColor);
                                        } else {
                                            setCustomColor(currentColor);
                                        }
                                    }}
                                    disabled={item.disabled}
                                    className={`
                                        px-2 py-1 text-xs font-mono rounded
                                        border ${item.error ? 'border-red-500' : 'border-gray-300'}
                                        focus:outline-none focus:ring-2 focus:ring-secondary-container focus:border-transparent
                                        ${item.disabled ? 'opacity-50 cursor-not-allowed' : ''}
                                        w-24
                                    `}
                                    placeholder="#000000"
                                />
                            </div>
                        )}

                        {item.showRgb && rgb && (
                            <div className="flex items-center gap-2 mt-1">
                                <span className={`text-xs text-on-surface-variant ${item.textSize || 'text-xs'}`}>RGB:</span>
                                <span className="text-xs font-mono text-on-surface">
                                    {rgb.r}, {rgb.g}, {rgb.b}
                                </span>
                            </div>
                        )}
                    </div>
                </div>

                {/* Picker popup */}
                {isOpen && !item.disabled && (
                    <div className="absolute z-20 mt-2 p-4 bg-white rounded-xl shadow-lg border border-gray-200 w-64">
                        {/* Color picker natif */}
                        <div className="mb-3">
                            <input
                                type="color"
                                value={getDisplayColor()}
                                onChange={(e) => handleColorChange(e.target.value)}
                                className="w-full h-32 rounded-lg cursor-pointer border border-gray-300 p-1"
                            />
                        </div>

                        {/* Presets personnalisés */}
                        {item.presets && item.presets.length > 0 && (
                            <div>
                                <p className="text-xs text-on-surface-variant mb-2">Couleurs suggérées</p>
                                <div className="grid grid-cols-8 gap-1.5">
                                    {item.presets.map((preset) => (
                                        <button
                                            key={preset}
                                            type="button"
                                            onClick={() => handleColorChange(preset)}
                                            className={`
                                                w-6 h-6 rounded-full border-2 
                                                ${currentColor === preset ? 'border-secondary-container' : 'border-transparent'}
                                                hover:scale-110 transition-transform
                                                relative
                                            `}
                                            style={{ backgroundColor: preset }}
                                        >
                                            {currentColor === preset && (
                                                <Check className="absolute inset-0 m-auto w-3 h-3"
                                                       style={{ color: getContrastColor(preset) }}
                                                />
                                            )}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Input hex personnalisé */}
                        <div className="mt-3">
                            <div className="flex items-center gap-2">
                                <span className="text-xs text-on-surface-variant">#</span>
                                <input
                                    type="text"
                                    value={customColor.replace('#', '')}
                                    onChange={(e) => {
                                        const val = e.target.value;
                                        setCustomColor(val);
                                        if (isValidHex(val)) {
                                            handleColorChange(val);
                                        }
                                    }}
                                    className="flex-1 px-2 py-1 text-xs font-mono rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-secondary-container focus:border-transparent"
                                    placeholder="000000"
                                    maxLength={6}
                                />
                                <button
                                    type="button"
                                    onClick={() => {
                                        if (isValidHex(customColor)) {
                                            handleColorChange(customColor);
                                        }
                                    }}
                                    className="px-3 py-1 text-xs text-white bg-secondary-container rounded hover:bg-secondary-container/90 transition-colors"
                                >
                                    OK
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {item.error && (
                    <p className="mt-1 text-sm text-red-500">{item.error}</p>
                )}
            </div>
        </div>
    );
}