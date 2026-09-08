import { useState } from "react";
import {X, FileSpreadsheet, FileText, FileJson, File, Download} from "lucide-react";
import type {ExportFormat, ExportScope, ExportTableType} from "@/components/types/table/export-table-type.ts";
import {ButtonUI} from "@/components/ui/button/button-ui.tsx";

export function ExportTable({
                                isOpen,
                                onClose,
                                onExport,
                                columns,
                                totalRows,
                                currentPageRows,
                                totalPages
                            }: ExportTableType) {
    const [selectedFormat, setSelectedFormat] = useState<ExportFormat>('csv');
    const [selectedScope, setSelectedScope] = useState<ExportScope>('all');
    const [selectedColumns, setSelectedColumns] = useState<string[]>(
        columns.map(col => col.key)
    );
    const [specificPage, setSpecificPage] = useState<number>(1);

    if (!isOpen) return null;

    // Couleurs par format
    const getFormatColors = (format: ExportFormat) => {
        switch (format) {
            case 'csv':
                return {
                    icon: 'text-green-500',
                    border: 'border-green-500',
                    bg: 'bg-green-50',
                    hover: 'hover:border-green-400'
                };
            case 'excel':
                return {
                    icon: 'text-green-700',
                    border: 'border-green-700',
                    bg: 'bg-green-100',
                    hover: 'hover:border-green-600'
                };
            case 'pdf':
                return {
                    icon: 'text-red-500',
                    border: 'border-red-500',
                    bg: 'bg-red-50',
                    hover: 'hover:border-red-400'
                };
            case 'xml':
                return {
                    icon: 'text-purple-500',
                    border: 'border-purple-500',
                    bg: 'bg-purple-50',
                    hover: 'hover:border-purple-400'
                };
            case 'json':
                return {
                    icon: 'text-orange-500',
                    border: 'border-orange-500',
                    bg: 'bg-orange-50',
                    hover: 'hover:border-orange-400'
                };
            default:
                return {
                    icon: 'text-gray-400',
                    border: 'border-gray-300',
                    bg: 'bg-white',
                    hover: 'hover:border-gray-400'
                };
        }
    };

    const formats: { value: ExportFormat; label: string; icon: any }[] = [
        { value: 'csv', label: 'CSV', icon: FileSpreadsheet },
        { value: 'excel', label: 'Excel', icon: FileSpreadsheet },
        { value: 'pdf', label: 'PDF', icon: FileText },
        { value: 'xml', label: 'XML', icon: File },
        { value: 'json', label: 'JSON', icon: FileJson }
    ];

    const handleColumnToggle = (key: string) => {
        setSelectedColumns(prev =>
            prev.includes(key)
                ? prev.filter(col => col !== key)
                : [...prev, key]
        );
    };

    const handleExport = () => {
        onExport(
            selectedFormat,
            selectedScope,
            selectedColumns,
            selectedScope === 'specific' ? specificPage : undefined
        );
        onClose();
    };
    const isAllSelected = selectedColumns.length === columns.length;

    return (
        <>
            {/* Overlay */}
            <div
                className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
                onClick={onClose}
            />

            {/* Modal */}
            <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-full max-w-2xl">
                <div className="bg-white rounded-2xl shadow-2xl max-h-[90vh] overflow-y-auto">
                    {/* Header */}
                    <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
                        <div>
                            <h2 className="text-sm font-semibold text-gray-900">
                                Exporter les données
                            </h2>
                            <p className="text-xs text-gray-500 mt-0.5">
                                {totalRows} enregistrement{totalRows > 1 ? 's' : ''} disponible{totalRows > 1 ? 's' : ''}
                            </p>
                        </div>
                        <button
                            onClick={onClose}
                            className="p-1 hover:bg-gray-100 rounded-lg transition-colors cursor-pointer"
                        >
                            <X className="w-5 h-5 text-gray-500" />
                        </button>
                    </div>

                    {/* Content */}
                    <div className="px-6 py-5 space-y-6">
                        {/* Format */}
                        <div>
                            <h3 className="text-xs font-medium text-gray-700 mb-3">FORMAT</h3>
                            <div className="grid grid-cols-5 gap-2">
                                {formats.map(({ value, label, icon: Icon }) => {
                                    const colors = getFormatColors(value);
                                    const isSelected = selectedFormat === value;

                                    return (
                                        <button
                                            key={value}
                                            onClick={() => setSelectedFormat(value)}
                                            className={`
                                                flex flex-col items-center gap-1.5 p-3 rounded-lg border-2 transition-all cursor-pointer
                                                ${isSelected
                                                ? `${colors.border} ${colors.bg}`
                                                : `border-gray-200 ${colors.hover} bg-white`
                                            }
                                            `}
                                        >
                                            <Icon className={`w-5 h-5 ${
                                                isSelected ? colors.icon : 'text-gray-400'
                                            }`} />
                                            <span className={`text-xs font-medium ${
                                                isSelected ? 'text-gray-900' : 'text-gray-700'
                                            }`}>
                                                {label}
                                            </span>
                                        </button>
                                    );
                                })}
                            </div>
                        </div>

                        {/* Colonnes */}
                        <div>
                            <h3 className="text-xs font-medium text-gray-700 mb-3">COLONNES À EXPORTER</h3>
                            <div className="bg-gray-50 rounded-lg p-3">
                                <div className="grid grid-cols-2 gap-2">
                                    {columns.map(({ key, title }) => (
                                        <label
                                            key={key}
                                            className="flex items-center gap-2 px-3 py-2 rounded hover:bg-gray-100 transition-colors cursor-pointer"
                                        >
                                            <input
                                                type="checkbox"
                                                checked={selectedColumns.includes(key)}
                                                onChange={() => handleColumnToggle(key)}
                                                className="w-4 h-4 text-black border-gray-300 rounded focus:ring-black"
                                            />
                                            <span className="text-sm text-gray-700">{title}</span>
                                        </label>
                                    ))}
                                </div>
                                <button
                                    onClick={() => {
                                        if (isAllSelected) {
                                            setSelectedColumns([]);
                                        } else {
                                            setSelectedColumns(columns.map(col => col.key));
                                        }
                                    }}
                                    className="mt-2 text-sm text-black hover:text-gray-700 font-medium"
                                >
                                    {isAllSelected ? 'Tout désélectionner' : 'Tout sélectionner'}
                                </button>
                            </div>
                        </div>

                        {/* Quantité de données */}
                        <div>
                            <h3 className="text-xs font-medium text-gray-700 mb-3">QUANTITÉ DE DONNÉES</h3>
                            <div className="space-y-2 bg-gray-50 rounded-lg p-3">
                                <label className="flex items-center gap-3 px-2 py-1.5 rounded hover:bg-gray-100 transition-colors cursor-pointer">
                                    <input
                                        type="radio"
                                        name="scope"
                                        value="all"
                                        checked={selectedScope === 'all'}
                                        onChange={() => setSelectedScope('all')}
                                        className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                                    />
                                    <span className="text-sm text-gray-700">
                                        Toutes les données <span className="text-gray-500 text-xs">({totalRows} lignes)</span>
                                    </span>
                                </label>
                                <label className="flex items-center gap-3 px-2 py-1.5 rounded hover:bg-gray-100 transition-colors cursor-pointer">
                                    <input
                                        type="radio"
                                        name="scope"
                                        value="current"
                                        checked={selectedScope === 'current'}
                                        onChange={() => setSelectedScope('current')}
                                        className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                                    />
                                    <span className="text-sm text-gray-700">
                                        Page actuelle <span className="text-gray-500 text-xs">({currentPageRows} lignes)</span>
                                    </span>
                                </label>
                                <label className="flex items-center gap-3 px-2 py-1.5 rounded hover:bg-gray-100 transition-colors cursor-pointer">
                                    <input
                                        type="radio"
                                        name="scope"
                                        value="specific"
                                        checked={selectedScope === 'specific'}
                                        onChange={() => setSelectedScope('specific')}
                                        className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                                    />
                                    <span className="text-sm text-gray-700">Page spécifique</span>
                                    {selectedScope === 'specific' && (
                                        <select
                                            value={specificPage}
                                            onChange={(e) => setSpecificPage(Number(e.target.value))}
                                            className="ml-2 px-2 py-1 text-sm border border-gray-300 rounded focus:ring-black focus:border-black"
                                            onClick={(e) => e.stopPropagation()}
                                        >
                                            {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                                                <option key={page} value={page}>
                                                    Page {page}
                                                </option>
                                            ))}
                                        </select>
                                    )}
                                </label>
                            </div>
                        </div>
                    </div>

                    {/* Footer */}
                    <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-gray-200 bg-gray-50/50 rounded-b-2xl">
                        <ButtonUI
                            state="normal"
                            type="button"
                            onClick={onClose}
                            text="Annuler"
                        />
                        <ButtonUI
                            type="button"
                            state={selectedColumns.length === 0 ? "disabled" : "normal"}
                            icon={Download}
                            text={`Exporter en ${formats.find(f => f.value === selectedFormat)?.label}`}
                            textSize="text-xs"
                            textColor="text-white"
                            bgColor="bg-black"
                            onClick={handleExport}
                        />
                    </div>
                </div>
            </div>
        </>
    );
}