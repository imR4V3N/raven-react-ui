import { Home } from 'lucide-react';
import type { ErrorType } from '@/components/types/error/error-type.ts';
import { ButtonUI } from '@/components/ui/button/button-ui.tsx';

export function ErrorUI(item: ErrorType) {

    // Obtenir le message d'erreur par défaut selon le code
    const getDefaultMessage = (code: number): string => {
        switch (code) {
            case 400:
                return 'Bad Request';
            case 401:
                return 'Unauthorized';
            case 403:
                return 'Forbidden';
            case 404:
                return 'Page Not Found';
            case 500:
                return 'Internal Server Error';
            case 502:
                return 'Bad Gateway';
            case 503:
                return 'Service Unavailable';
            default:
                return 'Something went wrong';
        }
    };

    const errorMessage = item.message || getDefaultMessage(item.error || 0);

    return (
        <div className={`
            min-h-screen flex items-center justify-center bg-gray-50 px-4 w-full
            ${item.className}
        `}>
            <div className="text-center max-w-2xl mx-auto">
                {/* Grand nombre d'erreur */}
                <div className="relative mb-8">
                    <h1 className="text-[150px] sm:text-[200px] font-bold text-gray-900 leading-none select-none">
                        {item.error}
                    </h1>

                    {/* Décoration de fond */}
                    <div className="absolute inset-0 flex items-center justify-center opacity-5">
                        <div className="w-64 h-64 bg-gray-400 rounded-full blur-3xl"></div>
                    </div>
                </div>

                {/* Titre de l'erreur */}
                <h2 className="text-2xl sm:text-3xl font-semibold text-gray-900 mb-3">
                    {errorMessage}
                </h2>

                {/* Description */}
                <p className="text-gray-500 text-base sm:text-lg mb-8 max-w-md mx-auto">
                    {item.description}
                </p>

                {/* Boutons d'action */}
                <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                    {item.link && (
                        <ButtonUI
                            type="button"
                            state="normal"
                            icon={Home}
                            text={item.linkText}
                            bgColor="bg-black"
                            textColor="text-white"
                            textSize="text-sm"
                            width="w-auto"
                            className="hover:bg-gray-800 hover:text-white"
                            onClick={() => {
                                if (item.link?.startsWith('http')) {
                                    window.location.href = item.link;
                                } else {
                                    // Utiliser react-router-dom
                                    if (typeof window !== 'undefined') {
                                        window.location.href = item.link || '';
                                    }
                                }
                            }}
                        />
                    )}
                </div>

                {/* Code d'erreur en petit */}
                <div className="mt-8">
                    <span className="text-xs font-mono text-gray-300 bg-gray-100 px-3 py-1 rounded-full">
                        Erreur {item.error}
                    </span>
                </div>
            </div>
        </div>
    );
}