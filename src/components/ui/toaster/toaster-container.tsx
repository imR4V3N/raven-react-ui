import { useToaster } from './toaster-context';
import { ToastItem } from './toast-item';

const POSITION_CLASSES: Record<string, string> = {
    'top-left': 'top-3 left-3 sm:top-4 sm:left-4 items-start',
    'top-center': 'top-3 left-1/2 -translate-x-1/2 sm:top-4 items-center',
    'top-right': 'top-3 right-3 sm:top-4 sm:right-4 items-end',
    'bottom-left': 'bottom-3 left-3 sm:bottom-4 sm:left-4 items-start',
    'bottom-center': 'bottom-3 left-1/2 -translate-x-1/2 sm:bottom-4 items-center',
    'bottom-right': 'bottom-3 right-3 sm:bottom-4 sm:right-4 items-end'
};

const POSITION_ORDER: Record<string, string> = {
    'top-left': 'flex-col',
    'top-center': 'flex-col',
    'top-right': 'flex-col',
    'bottom-left': 'flex-col-reverse',
    'bottom-center': 'flex-col-reverse',
    'bottom-right': 'flex-col-reverse'
};

export function ToasterContainer() {
    const { toasts, dismiss } = useToaster();

    // Grouper par position
    const groupedByPosition = toasts.reduce<Record<string, typeof toasts>>((acc, toast) => {
        const pos = toast.position || 'top-right';
        if (!acc[pos]) acc[pos] = [];
        acc[pos].push(toast);
        return acc;
    }, {});

    return (
        <>
            {Object.entries(groupedByPosition).map(([position, positionToasts]) => (
                <div
                    key={position}
                    className={`
                        fixed z-[9999] flex gap-2 pointer-events-none
                        w-[calc(100vw-1.5rem)] max-w-sm
                        sm:w-full sm:max-w-md
                        ${POSITION_CLASSES[position]}
                        ${POSITION_ORDER[position]}
                    `}
                    aria-label="Notifications"
                >
                    {positionToasts.map((toast) => (
                        <div key={toast.id} className="pointer-events-auto w-full">
                            <ToastItem toast={toast} onDismiss={dismiss} />
                        </div>
                    ))}
                </div>
            ))}
        </>
    );
}