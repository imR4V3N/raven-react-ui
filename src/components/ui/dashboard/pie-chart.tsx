import { useState, useMemo, useEffect, useRef } from 'react';
import type {
    PieChartType
} from '@/components/types/dashboard/pie-chart-type.ts';
import { ExportChartMenu } from "@/components/ui/dashboard/export-chart-menu.tsx";

// Palette de couleurs par défaut (personnalisable)
const DEFAULT_COLORS = [
    '#3B82F6', // blue-500
    '#10B981', // emerald-500
    '#F59E0B', // amber-500
    '#EF4444', // red-500
    '#8B5CF6', // violet-500
    '#EC4899', // pink-500
    '#06B6D4', // cyan-500
    '#1F2937', // gray-800
    '#84CC16', // lime-500
    '#F97316', // orange-500
];

export function PieChart({
                             title,
                             subtitle,
                             data,
                             type = 'pie',
                             size = 240,
                             width = 'w-full',
                             thickness = 60,
                             startAngle = 0,
                             endAngle = 360,
                             padAngle = 1,
                             showLegend = true,
                             showValues = false,
                             showPercentages = true,
                             showTooltip = true,
                             showCenterLabel = true,
                             centerLabel,
                             centerValue,
                             animated = true,
                             colors = DEFAULT_COLORS,
                             valueFormatter = (v) => v.toString(),
                             legendPosition = 'right',
                             className = '',
                             exportable = false
                         }: PieChartType) {
    const chartRef = useRef<HTMLDivElement>(null);

    const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
    const [mounted, setMounted] = useState(!animated);

    // Animation d'entrée
    useEffect(() => {
        if (animated) {
            const timer = setTimeout(() => setMounted(true), 50);
            return () => clearTimeout(timer);
        }
    }, [animated]);

    // Calculer le total
    const total = useMemo(() => {
        return data.reduce((sum, item) => sum + item.value, 0);
    }, [data]);

    // Calculer les segments
    const segments = useMemo(() => {
        const angleRange = endAngle - startAngle;
        let currentAngle = startAngle;

        return data.map((item, index) => {
            const percentage = total > 0 ? item.value / total : 0;
            const angle = percentage * angleRange;
            const segment = {
                ...item,
                percentage,
                startAngle: currentAngle,
                endAngle: currentAngle + angle,
                color: item.color || colors[index % colors.length],
                index
            };
            currentAngle += angle;
            return segment;
        });
    }, [data, total, startAngle, endAngle, colors]);

    // Convertir un angle en coordonnées SVG
    const polarToCartesian = (
        cx: number,
        cy: number,
        radius: number,
        angleInDegrees: number
    ) => {
        // -90 pour commencer en haut (12h)
        const angleInRadians = ((angleInDegrees - 90) * Math.PI) / 180;
        return {
            x: cx + radius * Math.cos(angleInRadians),
            y: cy + radius * Math.sin(angleInRadians)
        };
    };

    // Créer le path SVG pour un arc (secteur)
    const createArcPath = (
        cx: number,
        cy: number,
        radius: number,
        startAngle: number,
        endAngle: number,
        innerRadius: number = 0
    ): string => {
        const start = polarToCartesian(cx, cy, radius, endAngle);
        const end = polarToCartesian(cx, cy, radius, startAngle);
        const largeArcFlag = endAngle - startAngle <= 180 ? '0' : '1';

        if (innerRadius > 0) {
            // Doughnut
            const innerStart = polarToCartesian(cx, cy, innerRadius, endAngle);
            const innerEnd = polarToCartesian(cx, cy, innerRadius, startAngle);

            return [
                `M ${start.x} ${start.y}`,
                `A ${radius} ${radius} 0 ${largeArcFlag} 0 ${end.x} ${end.y}`,
                `L ${innerEnd.x} ${innerEnd.y}`,
                `A ${innerRadius} ${innerRadius} 0 ${largeArcFlag} 1 ${innerStart.x} ${innerStart.y}`,
                'Z'
            ].join(' ');
        }

        // Pie
        return [
            `M ${cx} ${cy}`,
            `L ${start.x} ${start.y}`,
            `A ${radius} ${radius} 0 ${largeArcFlag} 0 ${end.x} ${end.y}`,
            'Z'
        ].join(' ');
    };

    // Position du label (valeur / pourcentage) sur un segment
    const getLabelPosition = (
        cx: number,
        cy: number,
        radius: number,
        segment: typeof segments[0]
    ) => {
        const midAngle = (segment.startAngle + segment.endAngle) / 2;
        const labelRadius = type === 'doughnut'
            ? radius - thickness / 2
            : radius * 0.7;
        return polarToCartesian(cx, cy, labelRadius, midAngle);
    };

    // ==================== CHART SVG ====================
    const renderChart = () => {
        const radius = size / 2;
        const innerRadius = type === 'doughnut' ? radius - thickness : 0;
        const cx = radius;
        const cy = radius;

        return (
            <svg
                width={size}
                height={size}
                viewBox={`0 0 ${size} ${size}`}
                className="overflow-visible"
                style={{ maxWidth: '100%', height: 'auto' }}
            >
                {/* Segments */}
                {segments.map((segment) => {
                    const isHovered = hoveredIndex === segment.index;
                    const isOtherHovered = hoveredIndex !== null && !isHovered;

                    // Appliquer un padAngle
                    const pad = padAngle / 2;
                    const startAngle = segment.startAngle + pad;
                    const endAngle = segment.endAngle - pad;

                    // Si un seul segment, afficher un cercle complet
                    if (segments.length === 1) {
                        return (
                            <g key={segment.index}>
                                <circle
                                    cx={cx}
                                    cy={cy}
                                    r={radius}
                                    fill={segment.color}
                                    opacity={mounted ? (isOtherHovered ? 0.4 : 1) : 0}
                                    style={{
                                        transition: 'opacity 400ms ease-out, transform 200ms ease-out',
                                        transform: isHovered ? 'scale(1.03)' : 'scale(1)',
                                        transformOrigin: 'center',
                                        cursor: 'pointer'
                                    }}
                                    onMouseEnter={() => showTooltip && setHoveredIndex(segment.index)}
                                    onMouseLeave={() => setHoveredIndex(null)}
                                />
                                {type === 'doughnut' && (
                                    <circle
                                        cx={cx}
                                        cy={cy}
                                        r={innerRadius}
                                        fill="white"
                                    />
                                )}
                            </g>
                        );
                    }

                    const path = createArcPath(
                        cx,
                        cy,
                        radius,
                        startAngle,
                        endAngle,
                        innerRadius
                    );

                    return (
                        <path
                            key={segment.index}
                            d={path}
                            fill={segment.color}
                            opacity={mounted ? (isOtherHovered ? 0.4 : 1) : 0}
                            style={{
                                transition: 'opacity 400ms ease-out, transform 200ms ease-out',
                                transform: isHovered ? 'scale(1.03)' : 'scale(1)',
                                transformOrigin: 'center',
                                cursor: 'pointer',
                                transformBox: 'fill-box'
                            }}
                            onMouseEnter={() => showTooltip && setHoveredIndex(segment.index)}
                            onMouseLeave={() => setHoveredIndex(null)}
                        />
                    );
                })}

                {/* Labels (valeurs / pourcentages) */}
                {(showValues || showPercentages) && segments.map((segment) => {
                    const pos = getLabelPosition(cx, cy, radius, segment);
                    const isHovered = hoveredIndex === segment.index;

                    // Ne pas afficher si le segment est trop petit
                    if (segment.percentage < 0.05) return null;

                    return (
                        <text
                            key={`label-${segment.index}`}
                            x={pos.x}
                            y={pos.y}
                            textAnchor="middle"
                            dominantBaseline="middle"
                            className="pointer-events-none select-none"
                            style={{
                                fontSize: '11px',
                                fontWeight: 600,
                                fill: 'white',
                                opacity: mounted ? 1 : 0,
                                transition: 'opacity 400ms ease-out',
                                transform: isHovered ? 'scale(1.05)' : 'scale(1)',
                                transformOrigin: `${pos.x}px ${pos.y}px`
                            }}
                        >
                            {showValues && !showPercentages && valueFormatter(segment.value)}
                            {!showValues && showPercentages && `${Math.round(segment.percentage * 100)}%`}
                            {showValues && showPercentages && (
                                <>
                                    <tspan x={pos.x} dy="-4">{valueFormatter(segment.value)}</tspan>
                                    <tspan x={pos.x} dy="12" style={{ fontSize: '9px', opacity: 0.85 }}>
                                        {Math.round(segment.percentage * 100)}%
                                    </tspan>
                                </>
                            )}
                        </text>
                    );
                })}

                {/* Label central (uniquement doughnut) */}
                {type === 'doughnut' && showCenterLabel && (
                    <g>
                        {hoveredIndex !== null ? (
                            <>
                                <text
                                    x={cx}
                                    y={cy - 6}
                                    textAnchor="middle"
                                    className="fill-gray-900"
                                    style={{ fontSize: '20px', fontWeight: 700 }}
                                >
                                    {valueFormatter(segments[hoveredIndex].value)}
                                </text>
                                <text
                                    x={cx}
                                    y={cy + 14}
                                    textAnchor="middle"
                                    className="fill-gray-500"
                                    style={{ fontSize: '11px', fontWeight: 500 }}
                                >
                                    {segments[hoveredIndex].label.length > 12
                                        ? segments[hoveredIndex].label.slice(0, 12) + '…'
                                        : segments[hoveredIndex].label}
                                </text>
                                <text
                                    x={cx}
                                    y={cy + 30}
                                    textAnchor="middle"
                                    className="fill-gray-400"
                                    style={{ fontSize: '10px' }}
                                >
                                    {Math.round(segments[hoveredIndex].percentage * 100)}%
                                </text>
                            </>
                        ) : (
                            <>
                                <text
                                    x={cx}
                                    y={cy - 6}
                                    textAnchor="middle"
                                    className="fill-gray-900"
                                    style={{ fontSize: '22px', fontWeight: 700 }}
                                >
                                    {centerValue || valueFormatter(total)}
                                </text>
                                <text
                                    x={cx}
                                    y={cy + 14}
                                    textAnchor="middle"
                                    className="fill-gray-500"
                                    style={{ fontSize: '11px', fontWeight: 500 }}
                                >
                                    {centerLabel || 'Total'}
                                </text>
                            </>
                        )}
                    </g>
                )}
            </svg>
        );
    };

    // ==================== LÉGENDE ====================
    const renderLegend = () => {
        if (!showLegend || data.length === 0) return null;

        return (
            <div className={`
                flex gap-2 sm:gap-3
                ${legendPosition === 'bottom' ? 'flex-row flex-wrap justify-center mt-4 pt-4 border-t border-gray-100' : ''}
                ${legendPosition === 'top' ? 'flex-row flex-wrap justify-center mb-4 pb-4 border-b border-gray-100' : ''}
                ${legendPosition === 'right' ? 'flex-col' : ''}
                ${legendPosition === 'left' ? 'flex-col order-first' : ''}
            `}>
                {segments.map((segment) => {
                    const isHovered = hoveredIndex === segment.index;
                    return (
                        <button
                            key={segment.index}
                            type="button"
                            onMouseEnter={() => setHoveredIndex(segment.index)}
                            onMouseLeave={() => setHoveredIndex(null)}
                            className={`
                                flex items-center gap-2 px-2 py-1.5 rounded-lg
                                transition-all duration-200
                                ${isHovered ? 'bg-gray-100' : 'hover:bg-gray-50'}
                                cursor-pointer text-left min-w-0
                                ${legendPosition === 'bottom' ? 'shrink-0' : 'w-full'}
                            `}
                        >
                            <div
                                className="w-3 h-3 rounded-full shrink-0"
                                style={{ backgroundColor: segment.color }}
                            />
                            <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2">
                                    <span className="text-xs text-gray-700 truncate">
                                        {segment.label}
                                    </span>
                                </div>
                                <div className="flex items-center gap-2 mt-0.5">
                                    <span className="text-[10px] text-gray-500">
                                        {valueFormatter(segment.value)}
                                    </span>
                                    {showPercentages && (
                                        <span className="text-[10px] text-gray-400">
                                            ({Math.round(segment.percentage * 100)}%)
                                        </span>
                                    )}
                                </div>
                            </div>
                        </button>
                    );
                })}
            </div>
        );
    };

    // ==================== LAYOUT ====================
    const isHorizontalLayout = legendPosition === 'left' || legendPosition === 'right';

    return (
        <div className={`bg-white rounded-xl border border-gray-200 w-full md:${width} p-3 sm:p-5 ${className}`}>
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
            <div ref={chartRef} className="bg-white">
                {/* Légende top */}
                {showLegend && legendPosition === 'top' && renderLegend()}

                <div className={`
                    flex items-center justify-center gap-4 sm:gap-6
                    ${isHorizontalLayout ? 'flex-col sm:flex-row' : 'flex-col'}
                `}>
                    {/* Légende left */}
                    {showLegend && legendPosition === 'left' && (
                        <div className="w-full sm:w-48 shrink-0 order-2 sm:order-1">
                            {renderLegend()}
                        </div>
                    )}

                    {/* Chart */}
                    <div className="flex justify-center items-center">
                        {renderChart()}
                    </div>

                    {/* Légende right */}
                    {showLegend && legendPosition === 'right' && (
                        <div className="w-full sm:w-48 shrink-0 order-2">
                            {renderLegend()}
                        </div>
                    )}
                </div>

                {/* Légende bottom */}
                {showLegend && legendPosition === 'bottom' && renderLegend()}
            </div>

            {/* Tooltip */}
            {showTooltip && hoveredIndex !== null && (
                <div className="flex items-center justify-center gap-2 mt-3 text-xs text-gray-500">
                    <div
                        className="w-2 h-2 rounded-full"
                        style={{ backgroundColor: segments[hoveredIndex].color }}
                    />
                    <span className="font-medium text-gray-700">
                        {segments[hoveredIndex].label}
                    </span>
                    <span>:</span>
                    <span className="font-semibold text-gray-900">
                        {valueFormatter(segments[hoveredIndex].value)}
                    </span>
                    {showPercentages && (
                        <span className="text-gray-400">
                            ({Math.round(segments[hoveredIndex].percentage * 100)}%)
                        </span>
                    )}
                </div>
            )}
        </div>
    );
}