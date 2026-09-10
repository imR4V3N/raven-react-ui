import {useState, useMemo, useEffect, useRef} from 'react';
import type {
    BarChartType,
    BarChartDataItem,
    BarChartDataSet
} from '@/components/types/dashboard/bar-chart-type.ts';
import {ExportChartMenu} from "@/components/ui/dashboard/export-chart-menu.tsx";

// Palette de couleurs par défaut (personnalisables)
const DEFAULT_COLORS = [
    '#1F2937', // gray-800
    '#3B82F6', // blue-500
    '#10B981', // emerald-500
    '#F59E0B', // amber-500
    '#EF4444', // red-500
    '#8B5CF6', // violet-500
    '#EC4899', // pink-500
    '#06B6D4', // cyan-500
];

export function BarChart({
                             title,
                             subtitle,
                             data,
                             type,
                             direction = 'vertical',
                             height = 320,
                             width = 'w-full',
                             showGrid = true,
                             showLegend = true,
                             showValues = false,
                             showTooltip = true,
                             showXAxis = true,
                             showYAxis = true,
                             animated = true,
                             exportable = false,
                             colors = DEFAULT_COLORS,
                             valueFormatter = (v) => v.toString(),
                             className = ''
                         }: BarChartType) {

    const chartRef = useRef<HTMLDivElement>(null);

    const [hoveredBar, setHoveredBar] = useState<{
        datasetIndex: number;
        itemIndex: number;
        x: number;
        y: number;
    } | null>(null);

    // Détecter automatiquement le type si non précisé
    const chartType = useMemo((): 'simple' | 'grouped' | 'stacked' => {
        if (type) return type;

        // Si data est un tableau simple (BarChartDataItem[])
        if (data.length > 0 && 'label' in data[0] && 'value' in data[0]) {
            return 'simple';
        }

        // Si c'est un tableau de datasets
        return 'grouped';
    }, [type, data]);

    // Normaliser les données en datasets
    const datasets = useMemo((): BarChartDataSet[] => {
        if (chartType === 'simple') {
            return [{
                name: 'Valeur',
                data: data as BarChartDataItem[],
                color: colors[0]
            }];
        }
        return data as BarChartDataSet[];
    }, [data, chartType, colors]);

    // Extraire tous les labels uniques
    const labels = useMemo(() => {
        if (chartType === 'simple') {
            return (datasets[0].data as BarChartDataItem[]).map(d => d.label);
        }
        return datasets[0]?.data.map(d => d.label) || [];
    }, [datasets, chartType]);

    // Calculer le max pour l'échelle
    const maxValue = useMemo(() => {
        if (chartType === 'stacked') {
            // Pour stacked : somme des valeurs par label
            return Math.max(...labels.map((_, labelIndex) =>
                datasets.reduce((sum, ds) => sum + (ds.data[labelIndex]?.value || 0), 0)
            ));
        }
        // Pour simple/grouped : max individuel
        return Math.max(...datasets.flatMap(ds => ds.data.map(d => d.value)));
    }, [datasets, labels, chartType]);

    // Arrondir le max pour l'échelle
    const roundedMax = useMemo(() => {
        if (maxValue === 0) return 10;
        const magnitude = Math.pow(10, Math.floor(Math.log10(maxValue)));
        return Math.ceil(maxValue / magnitude) * magnitude;
    }, [maxValue]);

    // Générer les ticks de l'axe Y
    const yTicks = useMemo(() => {
        const tickCount = 5;
        const ticks: number[] = [];
        for (let i = 0; i <= tickCount; i++) {
            ticks.push((roundedMax / tickCount) * i);
        }
        return ticks;
    }, [roundedMax]);

    // Obtenir la couleur d'un dataset
    const getDatasetColor = (dsIndex: number): string => {
        const ds = datasets[dsIndex];
        return ds.color || colors[dsIndex % colors.length];
    };

    // Animation d'entrée
    const [mounted, setMounted] = useState(!animated);
    useEffect(() => {
        if (animated) {
            const timer = setTimeout(() => setMounted(true), 50);
            return () => clearTimeout(timer);
        }
    }, [animated]);

    // Calculer la hauteur d'une barre (en %)
    const getBarHeight = (value: number): number => {
        return (value / roundedMax) * 100;
    };

    // ==================== VERTICAL ====================
    const renderVerticalChart = () => {
        const chartHeight = height - 60; // Réserver de l'espace pour les labels

        return (
            <div className="flex flex-col" style={{ height }}>
                {/* Container principal */}
                <div className="flex-1 flex">
                    {/* Axe Y */}
                    {showYAxis && (
                        <div
                            className="flex flex-col justify-between pr-2 text-right"
                            style={{ height: chartHeight }}
                        >
                            {[...yTicks].reverse().map((tick, i) => (
                                <span key={i} className="text-xs text-gray-400 leading-none">
                                    {valueFormatter(tick)}
                                </span>
                            ))}
                        </div>
                    )}

                    {/* Zone de graphique */}
                    <div className="flex-1 relative">
                        {/* Grille horizontale */}
                        {showGrid && (
                            <div
                                className="absolute inset-0 flex flex-col justify-between"
                                style={{ height: chartHeight }}
                            >
                                {yTicks.map((_, i) => (
                                    <div key={i} className="border-t border-gray-100 w-full" />
                                ))}
                            </div>
                        )}

                        {/* Barres */}
                        <div
                            className="absolute inset-0 flex items-end justify-around gap-2"
                            style={{ height: chartHeight }}
                        >
                            {labels.map((_label, labelIndex) => {
                                if (chartType === 'stacked') {
                                    // Stacked : une barre empilée
                                    return (
                                        <div
                                            key={labelIndex}
                                            className="flex-1 flex flex-col justify-end items-center h-full relative"
                                        >
                                            {datasets.map((ds, dsIndex) => {
                                                const value = ds.data[labelIndex]?.value || 0;
                                                const barHeight = getBarHeight(value);
                                                return (
                                                    <div
                                                        key={dsIndex}
                                                        className="w-full max-w-[60px] transition-all duration-700 ease-out cursor-pointer relative"
                                                        style={{
                                                            height: mounted ? `${barHeight}%` : '0%',
                                                            backgroundColor: getDatasetColor(dsIndex),
                                                            transitionDelay: `${labelIndex * 50 + dsIndex * 30}ms`,
                                                        }}
                                                        onMouseEnter={(e) => {
                                                            if (showTooltip) {
                                                                const rect = (e.target as HTMLElement).getBoundingClientRect();
                                                                setHoveredBar({
                                                                    datasetIndex: dsIndex,
                                                                    itemIndex: labelIndex,
                                                                    x: rect.left + rect.width / 2,
                                                                    y: rect.top
                                                                });
                                                            }
                                                        }}
                                                        onMouseLeave={() => setHoveredBar(null)}
                                                    >
                                                        {showValues && value > 0 && (
                                                            <span className="absolute -top-5 left-1/2 -translate-x-1/2 text-xs font-medium text-gray-600">
                                                                {valueFormatter(value)}
                                                            </span>
                                                        )}
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    );
                                }

                                // Simple ou Grouped
                                return (
                                    <div
                                        key={labelIndex}
                                        className="flex-1 flex flex-col justify-end items-center h-full gap-0.5"
                                    >
                                        <div className="flex items-end justify-center gap-0.5 w-full h-full">
                                            {datasets.map((ds, dsIndex) => {
                                                const value = ds.data[labelIndex]?.value || 0;
                                                const barHeight = getBarHeight(value);
                                                return (
                                                    <div
                                                        key={dsIndex}
                                                        className="flex-1 max-w-[40px] transition-all duration-700 ease-out cursor-pointer relative rounded-t"
                                                        style={{
                                                            height: mounted ? `${barHeight}%` : '0%',
                                                            backgroundColor: ds.data[labelIndex]?.color || getDatasetColor(dsIndex),
                                                            transitionDelay: `${labelIndex * 50 + dsIndex * 30}ms`,
                                                        }}
                                                        onMouseEnter={(e) => {
                                                            if (showTooltip) {
                                                                const rect = (e.target as HTMLElement).getBoundingClientRect();
                                                                setHoveredBar({
                                                                    datasetIndex: dsIndex,
                                                                    itemIndex: labelIndex,
                                                                    x: rect.left + rect.width / 2,
                                                                    y: rect.top
                                                                });
                                                            }
                                                        }}
                                                        onMouseLeave={() => setHoveredBar(null)}
                                                    >
                                                        {showValues && value > 0 && (
                                                            <span className="absolute -top-5 left-1/2 -translate-x-1/2 text-xs font-medium text-gray-600 whitespace-nowrap">
                                                                {valueFormatter(value)}
                                                            </span>
                                                        )}
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>

                {/* Labels X */}
                {showXAxis && (
                    <div
                        className="flex justify-around mt-2"
                        style={showYAxis ? { paddingLeft: '40px' } : {}}
                    >
                        {labels.map((label, i) => (
                            <div key={i} className="flex-1 text-center">
                                <span className="text-xs text-gray-500 truncate block">
                                    {label}
                                </span>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        );
    };

    // ==================== HORIZONTAL ====================
    const renderHorizontalChart = () => {
        return (
            <div className="flex flex-col gap-3" style={{ minHeight: height }}>
                {labels.map((label, labelIndex) => {
                    if (chartType === 'stacked') {
                        const total = datasets.reduce(
                            (sum, ds) => sum + (ds.data[labelIndex]?.value || 0),
                            0
                        );

                        return (
                            <div key={labelIndex} className="flex items-center gap-3">
                                {showYAxis && (
                                    <span className="text-xs text-gray-500 w-20 truncate text-right">
                                        {label}
                                    </span>
                                )}
                                <div className="flex-1 flex h-8 rounded overflow-hidden bg-gray-100">
                                    {datasets.map((ds, dsIndex) => {
                                        const value = ds.data[labelIndex]?.value || 0;
                                        const percentage = total > 0 ? (value / roundedMax) * 100 : 0;
                                        return (
                                            <div
                                                key={dsIndex}
                                                className="h-full transition-all duration-700 ease-out cursor-pointer flex items-center justify-center"
                                                style={{
                                                    width: mounted ? `${percentage}%` : '0%',
                                                    backgroundColor: getDatasetColor(dsIndex),
                                                    transitionDelay: `${labelIndex * 50 + dsIndex * 30}ms`,
                                                }}
                                                onMouseEnter={(e) => {
                                                    if (showTooltip) {
                                                        const rect = (e.target as HTMLElement).getBoundingClientRect();
                                                        setHoveredBar({
                                                            datasetIndex: dsIndex,
                                                            itemIndex: labelIndex,
                                                            x: rect.left + rect.width / 2,
                                                            y: rect.top
                                                        });
                                                    }
                                                }}
                                                onMouseLeave={() => setHoveredBar(null)}
                                            >
                                                {showValues && value > 0 && percentage > 10 && (
                                                    <span className="text-xs font-medium text-white">
                                                        {valueFormatter(value)}
                                                    </span>
                                                )}
                                            </div>
                                        );
                                    })}
                                </div>
                                {showValues && (
                                    <span className="text-xs text-gray-600 w-12 text-right">
                                        {valueFormatter(total)}
                                    </span>
                                )}
                            </div>
                        );
                    }

                    // Simple ou Grouped
                    return (
                        <div key={labelIndex} className="flex flex-col gap-1">
                            {showYAxis && (
                                <span className="text-xs text-gray-500 font-medium">
                                    {label}
                                </span>
                            )}
                            <div className="flex flex-col gap-1">
                                {datasets.map((ds, dsIndex) => {
                                    const value = ds.data[labelIndex]?.value || 0;
                                    const percentage = (value / roundedMax) * 100;
                                    return (
                                        <div key={dsIndex} className="flex items-center gap-2">
                                            {chartType === 'grouped' && showLegend && (
                                                <span className="text-xs text-gray-400 w-16 truncate">
                                                    {ds.name}
                                                </span>
                                            )}
                                            <div className="flex-1 h-6 bg-gray-100 rounded overflow-hidden relative">
                                                <div
                                                    className="h-full transition-all duration-700 ease-out cursor-pointer rounded flex items-center justify-end pr-2"
                                                    style={{
                                                        width: mounted ? `${percentage}%` : '0%',
                                                        backgroundColor: ds.data[labelIndex]?.color || getDatasetColor(dsIndex),
                                                        transitionDelay: `${labelIndex * 50 + dsIndex * 30}ms`,
                                                    }}
                                                    onMouseEnter={(e) => {
                                                        if (showTooltip) {
                                                            const rect = (e.target as HTMLElement).getBoundingClientRect();
                                                            setHoveredBar({
                                                                datasetIndex: dsIndex,
                                                                itemIndex: labelIndex,
                                                                x: rect.left + rect.width / 2,
                                                                y: rect.top
                                                            });
                                                        }
                                                    }}
                                                    onMouseLeave={() => setHoveredBar(null)}
                                                >
                                                    {showValues && value > 0 && percentage > 15 && (
                                                        <span className="text-xs font-medium text-white">
                                                            {valueFormatter(value)}
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                            {showValues && (percentage <= 15) && (
                                                <span className="text-xs text-gray-600 w-10 text-right">
                                                    {valueFormatter(value)}
                                                </span>
                                            )}
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    );
                })}
            </div>
        );
    };

    // ==================== RENDU PRINCIPAL ====================
    return (
        <div className={`bg-white rounded-xl border border-gray-200 md:${width} w-full p-3 sm:p-5 ${className}`}>
            {/* Header */}
            <div className="flex items-start justify-between gap-2 sm:gap-4 mb-3 sm:mb-4">
                <div className="flex-1 min-w-0">
                    {title && (
                        <h3 className="text-sm sm:text-base font-semibold text-gray-900 truncate">
                            {title}
                        </h3>
                    )}
                    {subtitle && (
                        <p className="text-xs sm:text-sm text-gray-500 mt-0.5 truncate">
                            {subtitle}
                        </p>
                    )}
                </div>

                {exportable && (
                    <ExportChartMenu
                        chartRef={chartRef}
                        title={title}
                        onExportSuccess={(format) => {
                            console.log(`Chart exporté en ${format}`);
                        }}
                        onExportError={(error) => {
                            console.error('Erreur export:', error);
                        }}
                    />
                )}
            </div>

            {/* Zone exportable */}
            <div ref={chartRef} className="bg-white w-full">
                {/* Chart */}
                <div className="w-full">
                    {direction === 'vertical'
                        ? renderVerticalChart()
                        : renderHorizontalChart()
                    }
                </div>

                {/* Légende */}
                {showLegend && chartType !== 'simple' && datasets.length > 1 && (
                    <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-4 mt-3 sm:mt-4 pt-3 sm:pt-4 border-t border-gray-100">
                        {datasets.map((ds, i) => (
                            <div key={i} className="flex items-center gap-1.5 sm:gap-2">
                                <div
                                    className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-sm shrink-0"
                                    style={{ backgroundColor: getDatasetColor(i) }}
                                />
                                <span className="text-[10px] sm:text-xs text-gray-600 truncate max-w-[80px] sm:max-w-none">
                                {ds.name}
                            </span>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Tooltip */}
            {showTooltip && hoveredBar && (
                <div
                    className="fixed z-50 pointer-events-none bg-gray-900 text-white text-[10px] sm:text-xs rounded-lg px-2 sm:px-3 py-1.5 sm:py-2 shadow-xl max-w-[200px]"
                    style={{
                        left: hoveredBar.x,
                        top: hoveredBar.y - 12,
                        transform: 'translate(-50%, -100%)'
                    }}
                >
                    <div className="font-medium truncate">
                        {labels[hoveredBar.itemIndex]}
                    </div>
                    <div className="flex items-center gap-2 mt-1">
                        <div
                            className="w-2 h-2 rounded-full shrink-0"
                            style={{ backgroundColor: getDatasetColor(hoveredBar.datasetIndex) }}
                        />
                        <span className="text-gray-300 truncate">
                        {datasets[hoveredBar.datasetIndex].name}:
                    </span>
                        <span className="font-semibold">
                        {valueFormatter(
                            datasets[hoveredBar.datasetIndex].data[hoveredBar.itemIndex]?.value || 0
                        )}
                    </span>
                    </div>
                    <div
                        className="absolute left-1/2 -translate-x-1/2 top-full w-0 h-0"
                        style={{
                            borderLeft: '6px solid transparent',
                            borderRight: '6px solid transparent',
                            borderTop: '6px solid #111827'
                        }}
                    />
                </div>
            )}
        </div>
    );
}