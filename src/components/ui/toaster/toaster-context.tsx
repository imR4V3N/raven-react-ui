import { createContext, useContext, useState, useCallback, type ReactNode } from 'react';
import type { ToasterType, ToastItem } from '@/components/types/toaster/toaster-type';

interface ToasterContextValue {
    toasts: ToastItem[];
    show: (toast: ToasterType) => string;
    dismiss: (id: string) => void;
    dismissAll: () => void;
    success: (title: string, message?: string, options?: Partial<ToasterType>) => string;
    error: (title: string, message?: string, options?: Partial<ToasterType>) => string;
    info: (title: string, message?: string, options?: Partial<ToasterType>) => string;
    warning: (title: string, message?: string, options?: Partial<ToasterType>) => string;
    default: (title: string, message?: string, options?: Partial<ToasterType>) => string;
}

const ToasterContext = createContext<ToasterContextValue | null>(null);

export function useToaster() {
    const context = useContext(ToasterContext);
    if (!context) {
        throw new Error('useToaster doit être utilisé dans un <ToasterProvider>');
    }
    return context;
}

export function ToasterProvider({ children }: { children: ReactNode }) {
    const [toasts, setToasts] = useState<ToastItem[]>([]);

    const show = useCallback((toast: ToasterType): string => {
        const id = `toast-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
        const newToast: ToastItem = {
            id,
            createdAt: Date.now(),
            type: 'default',
            position: 'top-right',
            delay: 5000,
            ...toast
        };

        setToasts((prev) => [...prev, newToast]);
        return id;
    }, []);

    const dismiss = useCallback((id: string) => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
    }, []);

    const dismissAll = useCallback(() => {
        setToasts([]);
    }, []);

    // Raccourcis
    const success = useCallback(
        (title: string, message?: string, options?: Partial<ToasterType>) =>
            show({ type: 'success', title, message, ...options }),
        [show]
    );

    const error = useCallback(
        (title: string, message?: string, options?: Partial<ToasterType>) =>
            show({ type: 'error', title, message, ...options }),
        [show]
    );

    const info = useCallback(
        (title: string, message?: string, options?: Partial<ToasterType>) =>
            show({ type: 'info', title, message, ...options }),
        [show]
    );

    const warning = useCallback(
        (title: string, message?: string, options?: Partial<ToasterType>) =>
            show({ type: 'warning', title, message, ...options }),
        [show]
    );

    const defaultToast = useCallback(
        (title: string, message?: string, options?: Partial<ToasterType>) =>
            show({ type: 'default', title, message, ...options }),
        [show]
    );

    return (
        <ToasterContext.Provider
            value={{
            toasts,
                show,
                dismiss,
                dismissAll,
                success,
                error,
                info,
                warning,
                default: defaultToast
            }}
        >
        {children}
        </ToasterContext.Provider>
    );
}