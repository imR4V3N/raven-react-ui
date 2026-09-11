import { useState, useRef, useEffect, type KeyboardEvent, type ClipboardEvent } from 'react';
import type { InputOtpType } from '@/components/types/input/input-otp-type.ts';

export function InputOtp(item: InputOtpType) {
    const length = item.length || 6;
    const type = item.type || 'number';

    // Regex selon le type
    const sanitizeRegex = type === 'number' ? /\D/g : /[^a-zA-Z0-9]/g;

    const [otp, setOtp] = useState<string[]>(
        item.value || Array(length).fill('')
    );
    const [focusedIndex, setFocusedIndex] = useState<number | null>(null);
    const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

    const currentOtp = item.value !== undefined ? item.value : otp;

    // Focus sur le premier input au montage
    useEffect(() => {
        if (inputRefs.current[0] && !item.disabled) {
            inputRefs.current[0]?.focus();
        }
    }, []);

    // Mettre à jour les refs quand la longueur change
    useEffect(() => {
        inputRefs.current = inputRefs.current.slice(0, length);
    }, [length]);

    // Notifier le parent des changements
    const notifyChange = (newOtp: string[]) => {
        if (item.value === undefined) {
            setOtp(newOtp);
        }
        if (item.onChange) {
            item.onChange({
                target: {
                    name: item.name || '',
                    value: newOtp
                }
            } as any);
        }
    };

    // Gérer la saisie
    const handleChange = (index: number, val: string) => {
        // Ne garder que les chiffres
        const sanitized = val.replace(sanitizeRegex, '');
        if (!sanitized) return;

        const newOtp = [...currentOtp];
        newOtp[index] = sanitized.slice(-1);
        notifyChange(newOtp);

        // Passer au champ suivant
        if (index < length - 1) {
            inputRefs.current[index + 1]?.focus();
        }
    };

    // Gérer les touches
    const handleKeyDown = (index: number, e: KeyboardEvent<HTMLInputElement>) => {
        // Backspace
        if (e.key === 'Backspace') {
            e.preventDefault();

            const newOtp = [...currentOtp];

            if (newOtp[index]) {
                // Effacer le champ actuel
                newOtp[index] = '';
                notifyChange(newOtp);
            } else if (index > 0) {
                // Revenir en arrière et effacer
                newOtp[index - 1] = '';
                notifyChange(newOtp);
                inputRefs.current[index - 1]?.focus();
            }
        }

        // Flèche gauche
        if (e.key === 'ArrowLeft' && index > 0) {
            e.preventDefault();
            inputRefs.current[index - 1]?.focus();
        }

        // Flèche droite
        if (e.key === 'ArrowRight' && index < length - 1) {
            e.preventDefault();
            inputRefs.current[index + 1]?.focus();
        }

        // Delete
        if (e.key === 'Delete') {
            e.preventDefault();
            const newOtp = [...currentOtp];
            newOtp[index] = '';
            notifyChange(newOtp);
        }

        // Entrée - soumettre si complet
        if (e.key === 'Enter' && currentOtp.every(v => v)) {
            // Laisser le formulaire gérer la soumission
        }
    };

    // Gérer le collage
    const handlePaste = (e: ClipboardEvent<HTMLInputElement>) => {
        e.preventDefault();
        const pastedData = e.clipboardData.getData('text').replace(sanitizeRegex, '');

        if (!pastedData) return;

        const newOtp = [...currentOtp];
        const chars = pastedData.slice(0, length).split('');

        chars.forEach((char, i) => {
            if (i < length) {
                newOtp[i] = char;
            }
        });

        notifyChange(newOtp);

        // Focus sur le dernier champ rempli ou le suivant
        const lastIndex = Math.min(chars.length, length - 1);
        inputRefs.current[lastIndex]?.focus();
    };

    // Gérer le focus
    const handleFocus = (index: number) => {
        setFocusedIndex(index);
        // Sélectionner le contenu pour faciliter la saisie
        setTimeout(() => {
            inputRefs.current[index]?.select();
        }, 0);
    };

    const handleBlur = () => {
        setFocusedIndex(null);
    };

    return (
        <div className="flex flex-col w-fit ">
            {item.label && (
                <label
                    className={`font-caption text-caption text-on-surface-variant font-semibold block mb-2 ${item.textSize || 'text-xs'}`}
                >
                    {item.label} {item.isRequired && '*'}
                </label>
            )}

            <div
                className={`flex items-center gap-2 ${item.className}`}
            >
                {Array.from({ length }, (_, index) => {
                    const char = currentOtp[index] || '';
                    const isFocused = focusedIndex === index;
                    const hasValue = char !== '';

                    return (
                        <input
                            key={index}
                            ref={(el) => { inputRefs.current[index] = el; }}
                            type="text"
                            inputMode={type === 'number' ? 'numeric' : 'text'}
                            autoComplete="one-time-code"
                            pattern={type === 'number' ? '\d*' : '[a-zA-Z0-9]*'}
                            maxLength={1}
                            value={char.toUpperCase()}
                            placeholder={item.placeholder}
                            disabled={item.disabled}
                            onChange={(e) => handleChange(index, e.target.value)}
                            onKeyDown={(e) => handleKeyDown(index, e)}
                            onPaste={handlePaste}
                            onFocus={() => handleFocus(index)}
                            onBlur={handleBlur}
                            id={index === 0 ? item.id : undefined}
                            name={index === 0 ? item.name : undefined}
                            aria-label={`Chiffre ${index + 1} sur ${length}`}
                            className={`
                                ${item.width || 'w-10'} 
                                ${item.height || 'h-10'} 
                                ${item.textSize || 'text-xs'}
                                text-center font-semibold
                                rounded-xl
                                transition-all duration-200
                                outline-none
                                ${item.disabled
                                ? 'opacity-50 cursor-not-allowed bg-gray-50'
                                : 'bg-white cursor-text'
                            }
                                ${item.error
                                ? 'border-2 border-red-400 focus:border-red-500 focus:ring-2 focus:ring-red-200'
                                : isFocused
                                    ? 'border-2 border-black ring-4 ring-gray-100'
                                    : hasValue
                                        ? 'border-2 border-gray-200'
                                        : 'border-2 border-gray-200 hover:border-gray-300'
                            }
                                text-gray-900
                                caret-transparent
                                selection:bg-blue-100
                            `}
                        />
                    );
                })}
            </div>

            {item.error && (
                <p className="mt-2 text-sm text-red-500">{item.error}</p>
            )}
        </div>
    );
}