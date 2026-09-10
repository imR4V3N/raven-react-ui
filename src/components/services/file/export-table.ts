import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import type {ExportFormat, ExportOptions} from "@/components/types/table/export-table-type.ts";

export const generateExportFile = (
    data: any[],
    format: ExportFormat,
    columns: string[],
    options: ExportOptions = {}
) => {
    if (data.length === 0) {
        console.warn('Aucune donnée à exporter');
        return;
    }

    const filename = options.filename || `export_${new Date().toISOString().slice(0, 10)}`;

    switch (format) {
        case 'csv':
            exportCSV(data, columns, filename, options);
            break;
        case 'excel':
            exportExcel(data, columns, filename);
            break;
        case 'pdf':
            exportPDF(data, columns, filename);
            break;
        case 'json':
            exportJSON(data, columns, filename);
            break;
        case 'xml':
            exportXML(data, columns, filename);
            break;
        default:
            console.error(`Format d'export non supporté: ${format}`);
    }
};

/**
 * Export en CSV
 */
const exportCSV = (
    data: any[],
    columns: string[],
    filename: string,
    options: ExportOptions = {}
) => {
    const delimiter = options.delimiter || ',';
    const headers = columns.join(delimiter);

    const rows = data.map(row =>
        columns.map(col => {
            const value = row[col] !== undefined && row[col] !== null ? String(row[col]) : '';
            // Échapper les guillemets et les délimiteurs
            if (value.includes(delimiter) || value.includes('"') || value.includes('\n')) {
                return `"${value.replace(/"/g, '""')}"`;
            }
            return value;
        }).join(delimiter)
    );

    const csvContent = [headers, ...rows].join('\n');
    const blob = new Blob(['\uFEFF' + csvContent], { type: 'text/csv;charset=utf-8' }); // BOM pour UTF-8
    downloadFile(blob, `${filename}.csv`);
};

/**
 * Export en Excel (XLSX)
 */
const exportExcel = (data: any[], columns: string[], filename: string) => {
    // Préparer les données pour Excel
    const excelData = data.map(row => {
        const newRow: Record<string, any> = {};
        columns.forEach(col => {
            newRow[col] = row[col] !== undefined && row[col] !== null ? row[col] : '';
        });
        return newRow;
    });

    const ws = XLSX.utils.json_to_sheet(excelData);

    // Ajuster la largeur des colonnes
    ws['!cols'] = columns.map(col => ({
        wch: Math.max(col.length, 12)
    }));

    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Export');

    // Générer le fichier
    const wbout = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
    const blob = new Blob([wbout], { type: 'application/octet-stream' });
    downloadFile(blob, `${filename}.xlsx`);
};

/**
 * Export en PDF
 */
const exportPDF = (data: any[], columns: string[], filename: string) => {
    const doc = new jsPDF({
        orientation: 'landscape',
        unit: 'mm',
        format: 'a4'
    });

    // Ajouter un titre
    doc.setFontSize(16);
    doc.text('Export des données', 14, 15);
    doc.setFontSize(10);
    doc.text(`Généré le ${new Date().toLocaleDateString('fr-FR')} à ${new Date().toLocaleTimeString('fr-FR')}`, 14, 22);
    const rows = data.map(row => {
        const rowData: Record<string, any> = {};
        columns.forEach(col => {
            rowData[col] = row[col] !== undefined && row[col] !== null ? String(row[col]) : '';
        });
        return rowData;
    });

    // Générer la table
    autoTable(doc, {
        head: [columns],
        body: rows.map(row => columns.map(col => row[col] || '')),
        startY: 30,
        styles: {
            fontSize: 8,
            cellPadding: 2,
        },
        headStyles: {
            fillColor: [41, 128, 185],
            textColor: [255, 255, 255],
            fontSize: 9,
            fontStyle: 'bold',
        },
        alternateRowStyles: {
            fillColor: [245, 245, 245],
        },
        didDrawPage: function () {
            // Ajouter un pied de page
            const pageCount = doc.internal.getNumberOfPages();
            const currentPage = doc.internal.getCurrentPageInfo().pageNumber;
            doc.setFontSize(8);
            doc.text(
                `Page ${currentPage}/${pageCount}`,
                doc.internal.pageSize.width - 30,
                doc.internal.pageSize.height - 10
            );
        }
    });

    doc.save(`${filename}.pdf`);
};

/**
 * Export en JSON
 */
const exportJSON = (data: any[], columns: string[], filename: string) => {
    const exportData = data.map(row => {
        const newRow: Record<string, any> = {};
        columns.forEach(col => {
            newRow[col] = row[col] !== undefined && row[col] !== null ? row[col] : null;
        });
        return newRow;
    });

    const json = JSON.stringify(exportData, null, 2);
    const blob = new Blob([json], { type: 'application/json' });
    downloadFile(blob, `${filename}.json`);
};

/**
 * Export en XML
 */
const exportXML = (data: any[], columns: string[], filename: string) => {
    const createXMLNode = (name: string, value: any): string => {
        if (value === null || value === undefined) {
            return `<${name}/>`;
        }
        // Échapper les caractères spéciaux XML
        const escaped = String(value)
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&apos;');
        return `<${name}>${escaped}</${name}>`;
    };

    // Construire le XML
    let xml = '<?xml version="1.0" encoding="UTF-8"?>\n';
    xml += '<export>\n';
    xml += `  <metadata>\n`;
    xml += `    <generatedAt>${new Date().toISOString()}</generatedAt>\n`;
    xml += `    <recordCount>${data.length}</recordCount>\n`;
    xml += `    <columns>${columns.join(', ')}</columns>\n`;
    xml += `  </metadata>\n`;
    xml += '  <records>\n';

    data.forEach((row, index) => {
        xml += `    <record id="${index + 1}">\n`;
        columns.forEach(col => {
            const value = row[col] !== undefined && row[col] !== null ? row[col] : '';
            xml += `      ${createXMLNode(col, value)}\n`;
        });
        xml += `    </record>\n`;
    });

    xml += '  </records>\n';
    xml += '</export>';

    const blob = new Blob([xml], { type: 'application/xml' });
    downloadFile(blob, `${filename}.xml`);
};

/**
 * Télécharge un fichier à partir d'un Blob
 */
const downloadFile = (blob: Blob, filename: string) => {
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    setTimeout(() => {
        URL.revokeObjectURL(url);
    }, 100);
};