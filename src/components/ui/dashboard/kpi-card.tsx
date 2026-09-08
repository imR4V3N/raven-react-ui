import { ArrowUp, ArrowDown } from 'lucide-react';
import type { KpiType } from '@/components/types/dashboard/kpi-type.ts';

export function KpiCard(item: KpiType) {

    const formatValue = (val?: number): string => {
        if (val === undefined || val === null) return '0';

        // Si la valeur est >= 1000, formater avec des séparateurs
        if (val >= 1000) {
            return val.toLocaleString('fr-FR');
        }

        // Si c'est un nombre décimal
        if (val % 1 !== 0) {
            return val.toFixed(1);
        }

        return val.toString();
    };

    const getChangeIcon = () => {
        if (item.changeType === 'increase') return <ArrowUp className="w-3 h-3" />;
        if (item.changeType === 'decrease') return <ArrowDown className="w-3 h-3" />;
        return null;
    };

    return (
        <div className={`
            bg-white rounded-xl border border-gray-200 p-5
            hover:shadow-md transition-shadow duration-200
            ${item.className}
            ${item.width || 'w-65'}
            ${item.height || 'h-auto'}
        `}>
            {/* Header avec titre et icône */}
            <div className="flex flex-col mb-3">
                <div className="flex items-center justify-between">
                    <h3 className="text-xs font-semibold text-gray-700 uppercase tracking-wider">
                        {item.title}
                    </h3>
                    {item.icon && (
                        <div className="p-1.5 w-8 h-8 flex items-center justify-center rounded-lg bg-gray-100">
                            <item.icon className="w-4 h-4 text-gray-700" />
                        </div>
                    )}
                </div>

                {item.description && (
                    <span className="text-xs text-gray-500">
                    {item.description}
                </span>
                )}
            </div>



            {/* Valeur principale */}
            <div className="flex items-end justify-between mb-1">
                <div className="flex items-end gap-2">
                    <span className="text-xl font-semibold text-gray-900">
                        {formatValue(item.value)}
                    </span>
                    {item.unit && (
                        <span className="text-sm font-medium text-gray-500">
                            {item.unit}
                        </span>
                    )}
                </div>

                {/* Variation et description */}
                <div className="flex items-center gap-2 flex-wrap">
                    {item.change !== undefined && (
                        <div className={`
                        flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium
                        ${item.changeType === 'increase' ? 'bg-green-50 text-green-600' : ''}
                        ${item.changeType === 'decrease' ? 'bg-red-50 text-red-600' : ''}
                        ${item.changeType === 'neutral' ? 'bg-gray-50 text-gray-600' : ''}
                    `}>
                            {getChangeIcon()}
                            <span>{Math.abs(item.change)}%</span>
                        </div>
                    )}
                </div>
            </div>



            {/* Subtitle optionnel */}
            {item.subtitle && (
                <div className="mt-2 pt-2 border-t border-gray-100">
                    <p className="text-xs text-gray-400">
                        {item.subtitle}
                    </p>
                </div>
            )}
        </div>
    );
}