import { useState, useRef, useEffect } from 'react';
import type { TextareaType } from "@/components/types/input/textarea-type.ts";

export function Textarea(item: TextareaType) {

    const [textValue, setTextValue] = useState(item.value || '');
    const [charCount, setCharCount] = useState(item.value?.length || 0);
    const textareaRef = useRef<HTMLTextAreaElement>(null);

    const currentValue = item.value !== undefined ? item.value : textValue;

    // Auto-resize
    useEffect(() => {
        if (item.autoResize && textareaRef.current) {
            textareaRef.current.style.height = 'auto';
            const newHeight = Math.min(
                textareaRef.current.scrollHeight,
                parseInt(item.maxHeight || '400')
            );
            textareaRef.current.style.height = `${newHeight}px`;
        }
    }, [currentValue, item.autoResize, item.maxHeight]);

    const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        const newValue = e.target.value;
        setCharCount(newValue.length);

        if (item.value === undefined) {
            setTextValue(newValue);
        }

        if (item.onChange) {
            item.onChange(e);
        }
    };

    const getResizeClass = () => {
        switch (item.resize) {
            case 'none':
                return 'resize-none';
            case 'horizontal':
                return 'resize-x';
            case 'both':
                return 'resize';
            case 'vertical':
            default:
                return 'resize-y';
        }
    };

    const remainingChars = item.maxLength ? item.maxLength - charCount : undefined;

    return (
        <div className="flex flex-col w-fit">
            {item.label && (
                <label
                    className={`font-caption text-caption text-on-surface-variant font-semibold block mb-1 ${item.textSize || 'text-xs'}`}
                >
                    {item.label} {item.isRequired && '*'}
                </label>
            )}

            <div className="relative">
                <textarea
                    ref={textareaRef}
                    name={item.name}
                    id={item.id}
                    value={currentValue}
                    onChange={handleChange}
                    placeholder={item.placeholder}
                    disabled={item.disabled}
                    required={item.isRequired}
                    maxLength={item.maxLength}
                    minLength={item.minLength}
                    rows={item.rows || 2}
                    cols={item.cols || 2}
                    className={`
                        ${item.width || 'w-70'} ${item.height || 'h-20'} ${item.textSize || 'text-xs'}
                        px-3 py-2.5 rounded-lg
                        bg-surface-container-low text-on-surface
                        border ${item.error ? 'border-red-500' : 'border-gray-300'}
                        focus:outline-none focus:ring-2 focus:ring-secondary-container focus:border-transparent
                        ${item.disabled ? 'opacity-50 cursor-not-allowed' : ''}
                        ${getResizeClass()}
                        ${item.className}
                    `}
                    style={{
                        minHeight: item.height,
                        maxHeight: item.maxHeight || '400px'
                    }}
                />

                {item.maxLength && (
                    <div className={`
                        absolute bottom-2 right-3 text-xs 
                        ${remainingChars && remainingChars < 20
                        ? 'text-red-500'
                        : 'text-on-surface-variant/60'
                    }
                    `}>
                        {remainingChars} caractères restants
                    </div>
                )}
            </div>
            {item.error && (
                <p className="mt-1 text-sm text-red-500">{item.error}</p>
            )}
        </div>
    );
}