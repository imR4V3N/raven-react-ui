import { useEffect, useState } from 'react';
import { CheckCircle2, Info, XCircle, AlertTriangle, Bell, X } from 'lucide-react';
import type {ToasterAction, ToastItem as ToastItemType} from '@/components/types/toaster/toaster-type';

interface ToastItemProps {
    toast: ToastItemType;
    onDismiss: (id: string) => void;
}

const ICONS = {
    success: CheckCircle2,
    error: XCircle,
    info: Info,
    warning: AlertTriangle,
    default: Bell
};

const STYLES = {
    success: {
        icon: 'text-emerald-600',
        iconBg: 'bg-emerald-500',
        border: 'border-emerald-100',
        bg: 'bg-emerald-50',
        title: 'text-emerald-900',
        message: 'text-emerald-700/80',
        action: 'text-emerald-700 hover:text-emerald-900',
        progress: 'bg-emerald-500'
    },
    error: {
        icon: 'text-red-600',
        iconBg: 'bg-red-500',
        border: 'border-red-100',
        bg: 'bg-red-50',
        title: 'text-red-900',
        message: 'text-red-700/80',
        action: 'text-red-700 hover:text-red-900',
        progress: 'bg-red-500'
    },
    info: {
        icon: 'text-blue-600',
        iconBg: 'bg-blue-500',
        border: 'border-blue-100',
        bg: 'bg-blue-50',
        title: 'text-blue-900',
        message: 'text-blue-700/80',
        action: 'text-blue-700 hover:text-blue-900',
        progress: 'bg-blue-500'
    },
    warning: {
        icon: 'text-amber-600',
        iconBg: 'bg-amber-500',
        border: 'border-amber-100',
        bg: 'bg-amber-50',
        title: 'text-amber-900',
        message: 'text-amber-700/80',
        action: 'text-amber-700 hover:text-amber-900',
        progress: 'bg-amber-500'
    },
    default: {
        icon: 'text-gray-600',
        iconBg: 'bg-gray-700',
        border: 'border-gray-200',
        bg: 'bg-white',
        title: 'text-gray-900',
        message: 'text-gray-500',
        action: 'text-gray-700 hover:text-gray-900',
        progress: 'bg-gray-700'
    }
};

export function ToastItem({ toast, onDismiss }: ToastItemProps) {
    const [isVisible, setIsVisible] = useState(false);
    const [isLeaving, setIsLeaving] = useState(false);
    const [progress, setProgress] = useState(100);

    const type = toast.type || 'default';
    const styles = STYLES[type];
    const Icon = ICONS[type];
    const delay = toast.delay ?? 5000;
    const hasDelay = delay > 0;
    const hasActions = toast.action && toast.action.length > 0;

    // Animation d'entrée
    useEffect(() => {
        const timer = setTimeout(() => setIsVisible(true), 10);
        return () => clearTimeout(timer);
    }, []);

    // Auto-dismiss avec barre de progression
    useEffect(() => {
        if (!hasDelay) return;

        const startTime = Date.now();
        const interval = setInterval(() => {
            const elapsed = Date.now() - startTime;
            const remaining = Math.max(0, 100 - (elapsed / delay) * 100);
            setProgress(remaining);

            if (remaining <= 0) {
                clearInterval(interval);
                handleDismiss();
            }
        }, 50);

        return () => clearInterval(interval);
    }, [delay, hasDelay]);

    const handleDismiss = () => {
        setIsLeaving(true);
        setTimeout(() => onDismiss(toast.id), 250);
    };

    const handleAction = (action: ToasterAction) => {
        action.onClick();
        handleDismiss();
    };

    return (
        <div
            role="alert"
            aria-live="polite"
            className={`
                relative w-full overflow-hidden
                rounded-xl border shadow-lg
                ${styles.border} ${styles.bg}
                transition-all duration-300 ease-out
                ${isVisible && !isLeaving
                ? 'translate-x-0 opacity-100 scale-100'
                : 'translate-x-full opacity-0 scale-95'
            }
            `}
        >
            {/* Contenu */}
            <div className="flex items-start gap-3 p-4">
                {/* Icône */}
                <div className={`
                    flex-shrink-0 w-6 h-6 rounded-full 
                    ${styles.iconBg}
                    flex items-center justify-center
                    mt-0.5
                `}>
                    <Icon className="w-4 h-4 text-white" strokeWidth={2.5} />
                </div>

                {/* Texte */}
                <div className="flex-1 min-w-0">
                    {toast.title && (
                        <h4 className={`
                            text-sm font-semibold leading-snug
                            ${styles.title}
                        `}>
                            {toast.title}
                        </h4>
                    )}

                    {toast.message && (
                        <p className={`
                            text-xs leading-relaxed mt-1
                            ${styles.message}
                        `}>
                            {toast.message}
                        </p>
                    )}

                    {/* Actions */}
                    {hasActions && (
                        <div className="flex flex-wrap items-center gap-3 mt-3">
                            {toast.action!.map((action, idx) => (
                                <button
                                    key={idx}
                                    type="button"
                                    onClick={() => handleAction(action)}
                                    className={`
                                        text-xs font-medium
                                        transition-colors duration-150
                                        cursor-pointer
                                        ${styles.action}
                                    `}
                                >
                                    {action.label}
                                </button>
                            ))}
                        </div>
                    )}
                </div>

                {/* Bouton fermer */}
                <button
                    type="button"
                    onClick={handleDismiss}
                    aria-label="Fermer"
                    className={`
                        flex-shrink-0 p-1 -m-1 rounded-md
                        text-gray-400 hover:text-gray-600
                        hover:bg-black/5
                        transition-colors duration-150
                        cursor-pointer
                    `}
                >
                    <X className="w-4 h-4" />
                </button>
            </div>

            {/* Barre de progression */}
            {hasDelay && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-black/5">
                    <div
                        className={`h-full ${styles.progress} transition-all duration-50 ease-linear`}
                        style={{ width: `${progress}%` }}
                    />
                </div>
            )}
        </div>
    );
}