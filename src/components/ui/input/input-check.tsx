import { useState } from 'react';
import { Check } from 'lucide-react';
import type {InputCheckType} from "@/components/types/input/imput-check-type.ts";

export function InputCheck(item: InputCheckType) {
    const [isChecked, setIsChecked] = useState(item.defaultChecked || false);
    const [selectedValue, setSelectedValue] = useState(item.value || '');

    const currentChecked = item.checked !== undefined ? item.checked : isChecked;
    const currentValue = item.value !== undefined ? item.value : selectedValue;

    const isRadio = item.type === 'radio';

    // Gérer le changement pour un seul élément (checkbox/radio)
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (isRadio) {
            const newValue = e.target.value;
            if (item.value === undefined) {
                setSelectedValue(newValue);
            }
            if (item.onChange) {
                item.onChange({
                    target: {
                        name: item.name || '',
                        value: newValue
                    }
                } as React.ChangeEvent<HTMLInputElement>);
            }
        } else {
            const newChecked = e.target.checked;
            if (item.checked === undefined) {
                setIsChecked(newChecked);
            }
            if (item.onChange) {
                item.onChange({
                    target: {
                        name: item.name || '',
                        checked: newChecked,
                        value: e.target.value
                    }
                } as React.ChangeEvent<HTMLInputElement>);
            }
        }
    };

    // Rendu pour un seul élément (checkbox ou radio)
    const renderSingle = () => {
        const isCheckedState = isRadio
            ? currentValue === item.value
            : currentChecked;

        return (
            <div className="flex flex-col">
            <label className={`
                    flex items-center gap-2.5
                    ${item.disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
                    ${item.textSize || 'text-xs'}
                `}>
        <div className="relative">
        <input
            type={item.type}
        name={item.name}
        id={item.id}
        value={item.value}
        checked={isCheckedState}
        onChange={handleChange}
        disabled={item.disabled}
        className="sr-only"
        />
        <div className={`
                            w-5 h-5 rounded 
                            border-2 flex items-center justify-center
                            transition-all duration-200
                            ${isCheckedState
            ? 'bg-black border-secondary-container'
            : 'bg-white border-gray-300 hover:border-gray-400'
        }
                            ${item.disabled ? 'opacity-50 cursor-not-allowed' : ''}
                            ${isRadio ? 'rounded-full' : 'rounded'}
                            ${item.error ? 'border-red-500' : ''}
                        `}>
        {isCheckedState && (
            isRadio ? (
                <div className="w-2 h-2 bg-white rounded-full" />
            ) : (
                <Check className="w-3.5 h-3.5 text-white" />
            )
        )}
        </div>
        </div>
        {item.label && (
            <span className={`text-on-surface ${item.textSize || 'text-xs'}`}>
            {item.label} {item.isRequired && '*'}
            </span>
        )}
        </label>
        {item.error && (
            <p className="mt-1 text-sm text-red-500">{item.error}</p>
        )}
        </div>
    );
    };

    // Rendu pour un groupe (checkbox ou radio)
    const renderGroup = () => {
        if (!item.options || item.options.length === 0) return null;

        const getIsChecked = (optionValue: string) => {
            if (isRadio) {
                return currentValue === optionValue;
            } else {
                return Array.isArray(currentValue)
                    ? currentValue.includes(optionValue)
                    : currentValue === optionValue;
            }
        };

        const handleGroupChange = (optionValue: string, optionChecked?: boolean) => {
            if (isRadio) {
                if (item.value === undefined) {
                    setSelectedValue(optionValue);
                }
                if (item.onChange) {
                    item.onChange({
                        target: {
                            name: item.name || '',
                            value: optionValue
                        }
                    } as React.ChangeEvent<HTMLInputElement>);
                }
            } else {
                let newValue: string | string[];
                if (Array.isArray(currentValue)) {
                    newValue = optionChecked
                        ? [...currentValue, optionValue]
                        : currentValue.filter(v => v !== optionValue);
                } else {
                    newValue = optionChecked ? [optionValue] : [];
                }

                if (item.value === undefined) {
                    setSelectedValue(newValue as unknown as string);
                }
                if (item.onChange) {
                    item.onChange({
                        target: {
                            name: item.name || '',
                            value: newValue
                        }
                    } as unknown as React.ChangeEvent<HTMLInputElement>);
                }
            }
        };

        return (
            <div className="flex flex-col w-fit">
                {item.label && (
                    <label className={`font-caption text-caption text-on-surface-variant font-semibold block mb-2 ${item.textSize || 'text-xs'}`}>
        {item.label} {item.isRequired && '*'}
        </label>
    )}

        <div className={`
                    flex ${item.direction === 'horizontal' ? 'flex-wrap gap-4' : 'flex-col gap-2'}
                    ${item.className}
                `}>
        {item.options.map((option) => {
            const isChecked = getIsChecked(option.value);

            return (
                <label
                    key={option.value}
            className={`
                                    flex items-center gap-2.5
                                    ${item.disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
                                    ${item.textSize || 'text-xs'}
                                `}
        >
            <div className="relative">
            <input
                type={item.type}
            name={item.name}
            id={`${item.id}-${option.value}`}
            value={option.value}
            checked={isChecked}
            onChange={(e) => {
                if (isRadio) {
                    handleGroupChange(option.value);
                } else {
                    handleGroupChange(option.value, e.target.checked);
                }
            }}
            disabled={item.disabled}
            className="sr-only"
            />
            <div className={`
                                        w-5 h-5 rounded 
                                        border-2 flex items-center justify-center
                                        transition-all duration-200
                                        ${isChecked
                ? 'bg-black border-secondary-container'
                : 'bg-white border-gray-300 hover:border-gray-400'
            }
                                        ${item.disabled ? 'opacity-50 cursor-not-allowed' : ''}
                                        ${isRadio ? 'rounded-full' : 'rounded'}
                                        ${item.error ? 'border-red-500' : ''}
                                    `}>
            {isChecked && (
                isRadio ? (
                    <div className="w-2 h-2 bg-white rounded-full" />
                ) : (
                    <Check className="w-3.5 h-3.5 text-white" />
                )
            )}
            </div>
            </div>
            <span className={`text-on-surface ${item.textSize || 'text-xs'}`}>
            {option.label}
            </span>
            </label>
        );
        })}
        </div>

        {item.error && (
            <p className="mt-1 text-sm text-red-500">{item.error}</p>
        )}
        </div>
    );
    };

    // Si des options sont fournies, afficher un groupe
    if (item.options && item.options.length > 0) {
        return renderGroup();
    }

    // Sinon, afficher un seul élément
    return renderSingle();
}