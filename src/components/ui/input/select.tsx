import { useState, useRef, useEffect } from 'react';
import { X, Plus } from 'lucide-react';
import type { SelectType } from "@/components/types/input/select-type.ts";

export function Select(select: SelectType) {
    const [isOpen, setIsOpen] = useState(false);
    const [selectedValue, setSelectedValue] = useState<string | string[]>(
        select.defaultValue || (select.type === 'multiple' ? [] : '')
    );
    const [inputValue, setInputValue] = useState('');
    const containerRef = useRef<HTMLDivElement>(null);

    const currentValue = select.value !== undefined ? select.value : selectedValue;
    const isMultiple = select.type === 'multiple';

    const getSelectedLabel = (val: string) => {
        const option = select.options?.find(opt => opt.value === val);
        return option ? option.label : val;
    };

    // Fermer le dropdown en cliquant à l'extérieur
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    // Gérer la sélection simple
    const handleSelect = (val: string) => {
        if (isMultiple) {
            const newValue = Array.isArray(currentValue)
                ? currentValue.includes(val)
                    ? currentValue.filter(v => v !== val)
                    : [...currentValue, val]
                : [val];

            if (select.value === undefined) {
                setSelectedValue(newValue);
            }

            if (select.onChange) {
                select.onChange({
                    target: {
                        name: select.name || '',
                        value: newValue
                    }
                } as any);
            }
        } else {
            if (select.value === undefined) {
                setSelectedValue(val);
            }

            if (select.onChange) {
                select.onChange({
                    target: {
                        name: select.name || '',
                        value: val
                    }
                } as any);
            }
            setIsOpen(false);
        }
    };

    // Supprimer une valeur en mode multiple
    const removeValue = (val: string, e: React.MouseEvent) => {
        e.stopPropagation();
        if (Array.isArray(currentValue)) {
            const newValue = currentValue.filter(v => v !== val);
            if (select.value === undefined) {
                setSelectedValue(newValue);
            }
            if (select.onChange) {
                select.onChange({
                    target: {
                        name: select.name || '',
                        value: newValue
                    }
                } as any);
            }
        }
    };

    // Ajouter une nouvelle valeur en mode multiple
    const addNewTag = () => {
        if (inputValue.trim() && isMultiple) {
            const newTag = inputValue.trim();
            const newValue = Array.isArray(currentValue)
                ? [...currentValue, newTag]
                : [newTag];

            // Ajouter aux options si pas déjà présent
            if (!select.options?.find(opt => opt.value === newTag)) {
                select.options?.push({ label: newTag, value: newTag });
            }

            if (select.value === undefined) {
                setSelectedValue(newValue);
            }

            if (select.onChange) {
                select.onChange({
                    target: {
                        name: select.name || '',
                        value: newValue
                    }
                } as any);
            }
            setInputValue('');
        }
    };

    // Rendu pour mode multiple (Tags)
    const renderMultipleSelect = () => {
        const tags = Array.isArray(currentValue) ? currentValue : [];

        return (
            <div className="flex flex-col w-fit">
                {select.label && (
                    <label className={`font-caption text-caption text-on-surface-variant font-semibold block mb-1 ${select.textSize || 'text-xs'}`}>
                        {select.label} {select.isRequired && '*'}
                    </label>
                )}

                <div className="relative" ref={containerRef}>
                    <div
                        className={`
                            ${select.width || 'w-70'} min-h-[42px] px-3 py-1.5 rounded-lg
                            border ${select.error ? 'border-red-500' : 'border-gray-300'}
                            bg-white hover:border-gray-400
                            focus-within:ring-2 focus-within:ring-secondary-container focus-within:border-transparent
                            ${select.disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-text'}
                            flex flex-wrap items-center gap-1.5
                            transition-all duration-200
                            ${select.className}
                        `}
                        onClick={() => !select.disabled && setIsOpen(true)}
                    >
                        {/* Tags existants */}
                        {tags.map((tag) => (
                            <span
                                key={tag}
                                className={`inline-flex items-center gap-1 px-2.5 py-0.5 bg-blue-50 text-black rounded-full ${select.textSize || 'text-xs'} font-medium`}
                            >
                                {getSelectedLabel(tag)}
                                {select.disabled && (
                                    <button
                                        type="button"
                                        onClick={(e) => removeValue(tag, e)}
                                        className="hover:text-red-500 transition-colors"
                                    >
                                        <X className="w-3.5 h-3.5" />
                                    </button>
                                )}
                            </span>
                        ))}

                        {/* Input pour ajouter des tags */}
                        {!select.disabled && (
                            <div className="inline-flex items-center gap-1 flex-1 min-w-[100px]">
                                <input
                                    type="text"
                                    value={inputValue}
                                    onChange={(e) => setInputValue(e.target.value)}
                                    onKeyDown={(e) => {
                                        if (e.key === 'Enter') {
                                            e.preventDefault();
                                            addNewTag();
                                        }
                                    }}
                                    onFocus={() => setIsOpen(true)}
                                    placeholder={tags.length === 0 ? select.placeholder : ''}
                                    className={`border-none outline-none bg-transparent ${select.textSize || 'text-xs'} flex-1 min-w-[60px] p-0`}
                                    disabled={select.disabled}
                                />
                                {inputValue && (
                                    <button
                                        type="button"
                                        onClick={addNewTag}
                                        className="p-0.5 text-blue-600 hover:text-blue-700 transition-colors"
                                    >
                                        <Plus className="w-4 h-4" />
                                    </button>
                                )}
                            </div>
                        )}
                    </div>

                    {/* Dropdown pour mode multiple */}
                    {isOpen && !select.disabled && select.options && (
                        <div className={`absolute z-20 ${select.width || 'w-70'} mt-1 bg-white rounded-lg shadow-lg border border-gray-200 max-h-60 overflow-y-auto py-1`}>
                            {select.options?.map((option) => {
                                const isSelected = Array.isArray(currentValue) && currentValue.includes(option.value);
                                return (
                                    <button
                                        key={option.value}
                                        type="button"
                                        onClick={() => handleSelect(option.value)}
                                        className={`
                                            w-full px-3 py-2 text-left ${select.textSize || 'text-xs'}
                                            hover:bg-gray-50 transition-colors
                                            ${isSelected ? 'bg-blue-50 text-black' : 'text-gray-700'}
                                            flex items-center gap-2
                                        `}
                                    >
                                        <input
                                            type="checkbox"
                                            checked={isSelected}
                                            onChange={() => {}}
                                            className="w-3 h-3 text-black rounded border-gray-300 focus:ring-black"
                                        />
                                        <span>{option.label}</span>
                                    </button>
                                );
                            })}
                        </div>
                    )}
                </div>

                {select.error && (
                    <p className={`mt-1 ${select.textSize || 'text-xs'} text-red-500`}>{select.error}</p>
                )}
            </div>
        );
    };

    // Rendu pour mode simple (Select natif)
    const renderSimpleSelect = () => {
        return (
            <div className="flex flex-col">
                {select.label && (
                    <label className={`font-caption text-caption text-on-surface-variant font-semibold block mb-1 ${select.textSize || 'text-xs'}`}>
                        {select.label} {select.isRequired && '*'}
                    </label>
                )}

                <select
                    name={select.name || ''}
                    id={select.id}
                    value={currentValue as string || ''}
                    onChange={(e) => {
                        const val = e.target.value;
                        if (select.value === undefined) {
                            setSelectedValue(val);
                        }
                        if (select.onChange) {
                            select.onChange({
                                target: {
                                    name: select.name || '',
                                    value: val
                                }
                            } as any);
                        }
                    }}
                    disabled={select.disabled}
                    className={`
                        ${select.width || 'w-70'} ${select.height || 'h-10'} ${select.textSize || 'text-xs'}
                        px-3 py-2.5 rounded-lg
                        bg-surface-container-low text-on-surface
                        border ${select.error ? 'border-red-500' : 'border-gray-300'}
                        focus:outline-none focus:ring-2 focus:ring-secondary-container focus:border-transparent
                        ${select.disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
                        ${select.className}
                    `}
                    required={select.isRequired}
                >
                    {select.placeholder && (
                        <option value="" disabled>
                            {select.placeholder}
                        </option>
                    )}
                    {select.options?.map((option) => (
                        <option key={option.value} value={option.value}>
                            {option.label}
                        </option>
                    ))}
                </select>

                {select.error && (
                    <p className="mt-1 text-sm text-red-500">{select.error}</p>
                )}
            </div>
        );
    };

    // Rendre le composant approprié selon le type
    return isMultiple ? renderMultipleSelect() : renderSimpleSelect();
}