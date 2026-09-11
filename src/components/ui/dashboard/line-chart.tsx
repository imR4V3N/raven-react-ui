import { useState, useMemo, useEffect, useRef } from 'react';
import type {
    LineChartType,
    LineChartDataPoint,
    LineChartDataSet
} from '@/components/types/dashboard/line-chart-type.ts';
import {
    buildLinePath,
    buildSmoothPath,
    buildAreaPath,
    type Point
} from '@/components/services/chart/chart-path.ts';
import { ExportChartMenu } from "@/components/ui/dashboard/export-chart-menu.tsx";

// Palette de couleurs par défaut
const DEFAULT_COLORS = [
    '#3B82F6', // blue-500
    '#10B981', // emerald-500
    '#F59E0B', // amber-500
    '#EF4444', // red-500
    '#8B5CF6', // violet-500
    '#EC4899', // pink-500
    '#06B6D4', // cyan-500
    '#1F2937', // gray-800
];

export function LineChart({
                              title,
                              subtitle,
                              data,
                              type = 'line',
                              height = 320,
                              width = 'w-full',
                              showGrid = true,
                              showLegend = true,
                              showValues = false,
                              showTooltip = true,
                              showXAxis = true,
                              showYAxis = true,
                              showDots = true,
                              animated = true,
                              smooth = true,
                              curved = false,
                              exportable = false,
                              colors = DEFAULT_COLORS,
                              valueFormatter = (v) => v.toString(),
                              className = ''
                          }: LineChartType) {
    const chartRef = useRef<HTMLDivElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);

    const [hoveredPoint, setHoveredPoint] = useState<{
        datasetIndex: number;
        itemIndex: number;
        x: number;
        y: number;
    } | null>(null);

    const [mounted, setMounted] = useState(!animated);
    const [dimensions, setDimensions] = useState({ width: 600, height: 300 });

    // Détection automatique du type
    const chartType = useMemo((): 'simple' | 'multiple' => {
        if (data.length > 0 && 'label' in data[0] && 'value' in data[0]) {
            return 'simple';
        }
        return 'multiple';
    }, [data]);

    // Normaliser en datasets
    const datasets = useMemo((): LineChartDataSet[] => {
        if (chartType === 'simple') {
            return [{
                name: 'Valeur',
                data: data as LineChartDataPoint[],
                color: colors[0]
            }];
        }
        return data as LineChartDataSet[];
    }, [data, chartType, colors]);

    // Labels
    const labels = useMemo(() => {
        if (chartType === 'simple') {
            return (datasets[0].data as LineChartDataPoint[]).map(d => d.label);
        }
        return datasets[0]?.data.map(d => d.label) || [];
    }, [datasets, chartType]);

    // Max pour l'échelle
    const maxValue = useMemo(() => {
        return Math.max(...datasets.flatMap(ds => ds.data.map(d => d.value)));
    }, [datasets]);

    const roundedMax = useMemo(() => {
        if (maxValue === 0) return 10;
        const magnitude = Math.pow(10, Math.floor(Math.log10(maxValue)));
        return Math.ceil(maxValue / magnitude) * magnitude;
    }, [maxValue]);

    // Min pour l'échelle (utile si valeurs négatives)
    const minValue = useMemo(() => {
        return Math.min(0, ...datasets.flatMap(ds => ds.data.map(d => d.value)));
    }, [datasets]);

    // Ticks Y
    const yTicks = useMemo(() => {
        const tickCount = 5;
        const ticks: number[] = [];
        const range = roundedMax - minValue;
        for (let i = 0; i <= tickCount; i++) {
            ticks.push(minValue + (range / tickCount) * i);
        }
        return ticks;
    }, [roundedMax, minValue]);

    // Couleur d'un dataset
    const getDatasetColor = (dsIndex: number): string => {
        const ds = datasets[dsIndex];
        return ds.color || colors[dsIndex % colors.length];
    };

    // Animation
    useEffect(() => {
        if (animated) {
            const timer = setTimeout(() => setMounted(true), 50);
            return () => clearTimeout(timer);
        }
    }, [animated]);

    // Resize observer pour s'adapter à la largeur du conteneur
    useEffect(() => {
        if (!containerRef.current) return;

        const observer = new ResizeObserver((entries) => {
            for (const entry of entries) {
                const { width, height } = entry.contentRect;
                setDimensions({ width, height });
            }
        });

        observer.observe(containerRef.current);
        return () => observer.disconnect();
    }, []);

    // ==================== RENDU VERTICAL ====================
    const renderVerticalChart = () => {
        const padding = { top: 20, right: 20, bottom: 40, left: 50 };
        const chartWidth = Math.max(dimensions.width - padding.left - padding.right, 100);
        const chartHeight = height - padding.top - padding.bottom;

        // Calculer les positions des points
        const getX = (index: number) => {
            if (labels.length <= 1) return chartWidth / 2;
            return (index / (labels.length - 1)) * chartWidth;
        };

        const getY = (value: number) => {
            const range = roundedMax - minValue;
            const ratio = (value - minValue) / range;
            return chartHeight - ratio * chartHeight;
        };

        // Points par dataset
        const datasetsPoints: Point[][] = datasets.map(ds =>
            ds.data.map((d, i) => ({
                x: getX(i),
                y: getY(d.value)
            }))
        );

        const baseline = getY(minValue);

        return (
            <svg
                width="100%"
                height={height}
                viewBox={`0 0 ${dimensions.width} ${height}`}
                preserveAspectRatio="none"
                className="overflow-visible"
            >
                {/* Définitions pour les gradients d'area */}
                <defs>
                    {datasets.map((_, i) => (
                        <linearGradient
                            key={i}
                            id={`area-gradient-${i}`}
                            x1="0"
                            y1="0"
                            x2="0"
                            y2="1"
                        >
                            <stop offset="0%" stopColor={getDatasetColor(i)} stopOpacity="0.3" />
                            <stop offset="100%" stopColor={getDatasetColor(i)} stopOpacity="0.02" />
                        </linearGradient>
                    ))}
                </defs>

                {/* Groupe principal */}
                <g transform={`translate(${padding.left}, ${padding.top})`}>
                    {/* Grille horizontale */}
                    {showGrid && yTicks.map((_, i) => {
                        const y = (i / (yTicks.length - 1)) * chartHeight;
                        return (
                            <line
                                key={i}
                                x1={0}
                                y1={y}
                                x2={chartWidth}
                                y2={y}
                                stroke="#F3F4F6"
                                strokeWidth={1}
                            />
                        );
                    })}

                    {/* Axe Y */}
                    {showYAxis && yTicks.map((tick, i) => {
                        const y = (i / (yTicks.length - 1)) * chartHeight;
                        return (
                            <text
                                key={i}
                                x={-10}
                                y={y}
                                textAnchor="end"
                                dominantBaseline="middle"
                                className="text-[10px] sm:text-xs fill-gray-400"
                            >
                                {valueFormatter(tick)}
                            </text>
                        );
                    })}

                    {/* Zones (area) */}
                    {type === 'area' && datasets.map((_, dsIndex) => {
                        const areaPath = buildAreaPath(
                            datasetsPoints[dsIndex],
                            baseline,
                            smooth && !curved,
                            0.2
                        );
                        return (
                            <path
                                key={dsIndex}
                                d={areaPath}
                                fill={`url(#area-gradient-${dsIndex})`}
                                opacity={mounted ? 1 : 0}
                                style={{
                                    transition: `opacity 600ms ease-out ${dsIndex * 100}ms`
                                }}
                            />
                        );
                    })}

                    {/* Lignes */}
                    {datasets.map((_, dsIndex) => {
                        const points = datasetsPoints[dsIndex];
                        const path = curved
                            ? buildSmoothPath(points, 0.3)
                            : smooth
                                ? buildSmoothPath(points, 0.2)
                                : buildLinePath(points);

                        return (
                            <path
                                key={dsIndex}
                                d={path}
                                fill="none"
                                stroke={getDatasetColor(dsIndex)}
                                strokeWidth={2.5}
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                opacity={mounted ? 1 : 0}
                                style={{
                                    transition: `opacity 600ms ease-out ${dsIndex * 100}ms`
                                }}
                                // Animation du tracé
                                strokeDasharray={mounted ? 'none' : '1000'}
                                strokeDashoffset={mounted ? 0 : 1000}
                            />
                        );
                    })}

                    {/* Points */}
                    {showDots && datasets.map((ds, dsIndex) =>
                        ds.data.map((_d, i) => {
                            const point = datasetsPoints[dsIndex][i];
                            const isHovered = hoveredPoint?.datasetIndex === dsIndex
                                && hoveredPoint?.itemIndex === i;

                            return (
                                <g key={`${dsIndex}-${i}`}>
                                    {/* Halo au survol */}
                                    {isHovered && (
                                        <circle
                                            cx={point.x}
                                            cy={point.y}
                                            r={10}
                                            fill={getDatasetColor(dsIndex)}
                                            opacity={0.2}
                                        />
                                    )}
                                    <circle
                                        cx={point.x}
                                        cy={point.y}
                                        r={isHovered ? 6 : 4}
                                        fill="white"
                                        stroke={getDatasetColor(dsIndex)}
                                        strokeWidth={2}
                                        style={{
                                            transition: 'all 200ms ease-out',
                                            cursor: 'pointer'
                                        }}
                                        onMouseEnter={(e) => {
                                            if (showTooltip) {
                                                const rect = (e.target as SVGElement)
                                                    .closest('svg')!
                                                    .getBoundingClientRect();
                                                setHoveredPoint({
                                                    datasetIndex: dsIndex,
                                                    itemIndex: i,
                                                    x: rect.left + padding.left + point.x,
                                                    y: rect.top + padding.top + point.y
                                                });
                                            }
                                        }}
                                        onMouseLeave={() => setHoveredPoint(null)}
                                    />
                                    {/* Zone de hover invisible (plus grande) */}
                                    <circle
                                        cx={point.x}
                                        cy={point.y}
                                        r={12}
                                        fill="transparent"
                                        style={{ cursor: 'pointer' }}
                                        onMouseEnter={(e) => {
                                            if (showTooltip) {
                                                const rect = (e.target as SVGElement)
                                                    .closest('svg')!
                                                    .getBoundingClientRect();
                                                setHoveredPoint({
                                                    datasetIndex: dsIndex,
                                                    itemIndex: i,
                                                    x: rect.left + padding.left + point.x,
                                                    y: rect.top + padding.top + point.y
                                                });
                                            }
                                        }}
                                        onMouseLeave={() => setHoveredPoint(null)}
                                    />
                                </g>
                            );
                        })
                    )}

                    {/* Valeurs affichées */}
                    {showValues && datasets.map((ds, dsIndex) =>
                        ds.data.map((d, i) => {
                            const point = datasetsPoints[dsIndex][i];
                            const offset = dsIndex * 14;
                            return (
                                <text
                                    key={`value-${dsIndex}-${i}`}
                                    x={point.x}
                                    y={point.y - 10 - offset}
                                    textAnchor="middle"
                                    className="text-[10px] sm:text-xs font-medium fill-gray-600"
                                >
                                    {valueFormatter(d.value)}
                                </text>
                            );
                        })
                    )}

                    {/* Labels X */}
                    {showXAxis && labels.map((label, i) => {
                        const x = getX(i);
                        return (
                            <text
                                key={i}
                                x={x}
                                y={chartHeight + 20}
                                textAnchor="middle"
                                className="text-[10px] sm:text-xs fill-gray-500"
                            >
                                {label.length > 10 ? label.slice(0, 10) + '…' : label}
                            </text>
                        );
                    })}
                </g>
            </svg>
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
                        onExportSuccess={(format) => console.log(`Chart exporté en ${format}`)}
                        onExportError={(error) => console.error('Erreur export:', error)}
                    />
                )}
            </div>

            {/* Zone exportable */}
            <div ref={chartRef} className="bg-white w-full">
                <div ref={containerRef} className="w-full">
                    {renderVerticalChart()}
                </div>

                {/* Légende */}
                {showLegend && chartType === 'multiple' && datasets.length > 1 && (
                    <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-4 mt-3 sm:mt-4 pt-3 sm:pt-4 border-t border-gray-100">
                        {datasets.map((ds, i) => (
                            <div key={i} className="flex items-center gap-1.5 sm:gap-2">
                                <div
                                    className="w-3 h-3 rounded-full shrink-0"
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
            {showTooltip && hoveredPoint && (
                <div
                    className="fixed z-50 pointer-events-none bg-gray-900 text-white text-[10px] sm:text-xs rounded-lg px-2 sm:px-3 py-1.5 sm:py-2 shadow-xl max-w-[200px]"
                    style={{
                        left: hoveredPoint.x,
                        top: hoveredPoint.y - 12,
                        transform: 'translate(-50%, -100%)'
                    }}
                >
                    <div className="font-medium truncate">
                        {labels[hoveredPoint.itemIndex]}
                    </div>
                    <div className="flex items-center gap-2 mt-1">
                        <div
                            className="w-2 h-2 rounded-full shrink-0"
                            style={{ backgroundColor: getDatasetColor(hoveredPoint.datasetIndex) }}
                        />
                        <span className="text-gray-300 truncate">
                            {datasets[hoveredPoint.datasetIndex].name}:
                        </span>
                        <span className="font-semibold">
                            {valueFormatter(
                                datasets[hoveredPoint.datasetIndex].data[hoveredPoint.itemIndex]?.value || 0
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