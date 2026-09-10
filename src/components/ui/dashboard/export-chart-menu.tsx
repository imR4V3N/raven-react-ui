// components/ui/chart/chart-export-menu.tsx
import { useState, useRef, useEffect } from 'react';
import { MoreVertical, Image, FileText } from 'lucide-react';
import {
    exportChartAsImage,
    exportChartAsPDF,
    formatFilename
} from '@/components/services/file/export-chart.ts';

interface ChartExportMenuProps {
    chartRef: React.RefObject<HTMLDivElement | null>;
    title?: string;
    onExportSuccess?: (format: 'image' | 'pdf') => void;
    onExportError?: (error: Error) => void;
}

export function ExportChartMenu({
                                    chartRef,
                                    title,
                                    onExportSuccess,
                                    onExportError
                                }: ChartExportMenuProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [isExporting, setIsExporting] = useState(false);
    const menuRef = useRef<HTMLDivElement>(null);

    // Fermer le menu en cliquant à l'extérieur
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleExport = async (format: 'image' | 'pdf') => {
        if (!chartRef.current) return;

        setIsExporting(true);
        const filename = formatFilename(title);

        try {
            if (format === 'image') {
                await exportChartAsImage(chartRef.current, filename);
            } else {
                await exportChartAsPDF(chartRef.current, filename);
            }
            onExportSuccess?.(format);
        } catch (error) {
            console.error('Erreur export:', error);
            onExportError?.(error as Error);
        } finally {
            setIsExporting(false);
            setIsOpen(false);
        }
    };

    return (
        <div className="relative" ref={menuRef}>
            {/* Bouton 3 points */}
            <button
                type="button"
                onClick={() => setIsOpen(!isOpen)}
                className="
                    p-1.5 rounded-lg
                    text-gray-400 hover:text-gray-600
                    hover:bg-gray-100
                    transition-colors duration-200
                    cursor-pointer
                "
                aria-label="Options d'export"
                aria-expanded={isOpen}
            >
                <MoreVertical className="w-4 h-4" />
            </button>

            {/* Menu flottant */}
            {isOpen && (
                <div className="
                    absolute right-0 top-full mt-1 z-30
                    bg-white rounded-lg shadow-lg border border-gray-200
                    min-w-[180px] py-1
                    animate-fadeIn
                ">
                    <div className="px-3 py-1.5 border-b border-gray-100">
                        <span className="text-xs font-medium text-gray-500 uppercase">
                            Exporter
                        </span>
                    </div>

                    <button
                        type="button"
                        onClick={() => handleExport('image')}
                        disabled={isExporting}
                        className="
                            w-full flex items-center gap-2.5 px-3 py-2
                            text-sm text-gray-700
                            hover:bg-gray-50
                            transition-colors duration-150
                            disabled:opacity-50 disabled:cursor-not-allowed
                            cursor-pointer
                        "
                    >
                        <Image className="w-4 h-4 text-blue-500" />
                        <span>Exporter en image</span>
                    </button>

                    <button
                        type="button"
                        onClick={() => handleExport('pdf')}
                        disabled={isExporting}
                        className="
                            w-full flex items-center gap-2.5 px-3 py-2
                            text-sm text-gray-700
                            hover:bg-gray-50
                            transition-colors duration-150
                            disabled:opacity-50 disabled:cursor-not-allowed
                            cursor-pointer
                        "
                    >
                        <FileText className="w-4 h-4 text-red-500" />
                        <span>Exporter en PDF</span>
                    </button>

                    {isExporting && (
                        <div className="px-3 py-2 border-t border-gray-100">
                            <div className="flex items-center gap-2 text-xs text-gray-500">
                                <div className="w-3 h-3 border-2 border-gray-300 border-t-gray-600 rounded-full animate-spin" />
                                <span>Export en cours...</span>
                            </div>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}