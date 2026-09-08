import type {ButtonType} from "../../types/button/button-type";

export function ButtonUI(element: ButtonType) {
    const isDisabled = element.state === "disabled" || element.state === "loading";

    const LoadingIndicator = () => {
        if (element.loadingType === 'dots') {
            return (
                <div className="flex gap-1 items-center">
                    <span className="w-2 h-2 bg-current rounded-full animate-ping" style={{ animationDelay: '0ms' }}></span>
                    <span className="w-2 h-2 bg-current rounded-full animate-ping" style={{ animationDelay: '200ms' }}></span>
                    <span className="w-2 h-2 bg-current rounded-full animate-ping" style={{ animationDelay: '400ms' }}></span>
                </div>
            );
        }

        if (element.loadingType === 'pulse') {
            return (
                <div className="relative w-4 h-4">
                    <div className="absolute inset-0 bg-current rounded-full opacity-75 animate-ping"></div>
                    <div className="absolute inset-1 bg-current rounded-full"></div>
                </div>
            );
        }

        return (
            <div className="relative w-4 h-4">
                <div className="absolute inset-0 border-2 border-current rounded-full opacity-25"></div>
                <div className="absolute inset-0 border-2 border-current rounded-full border-t-transparent animate-spin"></div>
            </div>
        );
    };

    return (
        <button
            type={element.type}
            onClick={isDisabled ? undefined : element.onClick}
            disabled={isDisabled}
            className={`
                ${element.bgColor || 'bg-white'} 
                ${element.textColor || 'text-gray-700'} 
                ${element.width || 'w-auto'} 
                ${element.height || 'h-auto'} 
                ${element.textSize || 'text-sm'}
                ${element.className} 
                border border-gray-200 rounded-xl 
                flex items-center justify-center gap-2 
                px-4 py-2.5
                transition-all duration-300
                ${isDisabled ? 'opacity-60 cursor-not-allowed' : `hover:${element.hoverBg || 'bg-gray-50'} hover:${element.hoverText || 'text-gray-900'} hover:border-gray-300 active:scale-[0.98]`}
                relative
                min-h-[42px]
                min-w-[42px]
                font-medium
                cursor-pointer
            `}
            aria-disabled={isDisabled}
        >
            {element.state === "loading" ? (
                <>
                    <LoadingIndicator />
                    {element.loadingText && (
                        <span className="flex-shrink-0 text-xs opacity-75 ml-1">
                            {element.loadingText}
                        </span>
                    )}
                </>
            ) : (
                <>
                    {element.icon && (
                        <element.icon className="w-4 h-4 flex-shrink-0" />
                    )}
                    {element.text && (
                        <span className="flex-shrink-0">{element.text}</span>
                    )}
                </>
            )}
        </button>
    );
}