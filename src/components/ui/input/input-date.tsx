import { useState, useRef } from 'react';
import type { InputDateType } from "@/components/types/input/input-date-type.ts";

export function InputDate(item: InputDateType) {

    const [selectedDate, setSelectedDate] = useState(item.value || '');
    const inputRef = useRef<HTMLInputElement>(null);

    const currentValue = item.value !== undefined ? item.value : selectedDate;

    // Gérer le changement de date
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newValue = e.target.value;

        if (item.value === undefined) {
            setSelectedDate(newValue);
        }

        if (item.onChange) {
            item.onChange({
                target: {
                    name: item.name || '',
                    value: newValue
                }
            } as React.ChangeEvent<HTMLInputElement>);
        }
    };

    return (
        <div className="flex flex-col w-fit ">
            {item.label && (
                <label
                    className={`font-caption text-caption text-on-surface-variant font-semibold block mb-1 ${item.textSize || 'text-xs'}`}
                >
                    {item.label} {item.isRequired && '*'}
                </label>
            )}

            <div className="relative">
                {/* Input natif */}
                <input
                    ref={inputRef}
                    type={item.type}
                    name={item.name}
                    id={item.id}
                    value={currentValue}
                    onChange={handleChange}
                    disabled={item.disabled}
                    min={item.min}
                    max={item.max}
                    step={item.step}
                    className={`
                        ${item.width || 'w-70'} ${item.height || 'h-10'} ${item.textSize || 'text-xs'}
                        px-3 py-2.5 rounded-lg
                        bg-surface-container-low text-on-surface
                        border ${item.error ? 'border-red-500' : 'border-gray-300'}
                        focus:outline-none focus:ring-2 focus:ring-secondary-container focus:border-transparent
                        ${item.disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
                        ${item.className}
                    `}
                />
            </div>

            {item.error && (
                <p className={`mt-1 ${item.textSize || 'text-xs'} text-red-500`}>
                    {item.error}
                </p>
            )}
        </div>
    );
}