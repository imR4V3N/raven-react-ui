import { toPng } from 'html-to-image';
import jsPDF from 'jspdf';

/**
 * Exporte un élément HTML en image PNG
 */
export const exportChartAsImage = async (
    element: HTMLElement,
    filename: string = 'chart'
): Promise<void> => {
    try {
        const dataUrl = await toPng(element, {
            quality: 1,
            pixelRatio: 2,
            backgroundColor: '#ffffff',
            cacheBust: true,
            style: {
                transform: 'scale(1)',
            }
        });

        const link = document.createElement('a');
        link.href = dataUrl;
        link.download = `${filename}_${new Date().toISOString().slice(0, 10)}.png`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        console.log('Image exportée avec succès');
    } catch (error) {
        console.error('Erreur lors de l\'export en image:', error);
        throw error;
    }
};

/**
 * Exporte un élément HTML en PDF
 */
export const exportChartAsPDF = async (
    element: HTMLElement,
    filename: string = 'chart'
): Promise<void> => {
    try {
        const dataUrl = await toPng(element, {
            quality: 1,
            pixelRatio: 2,
            backgroundColor: '#ffffff',
            cacheBust: true,
        });

        // Calculer les dimensions réelles
        const img = new Image();
        img.src = dataUrl;
        await new Promise((resolve) => { img.onload = resolve; });

        const pdf = new jsPDF({
            orientation: img.width > img.height ? 'landscape' : 'portrait',
            unit: 'mm',
            format: 'a4',
        });

        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = pdf.internal.pageSize.getHeight();
        const ratio = Math.min(pdfWidth / img.width, pdfHeight / img.height);
        const imgX = (pdfWidth - img.width * ratio) / 2;
        const imgY = (pdfHeight - img.height * ratio) / 2;

        pdf.addImage(
            dataUrl,
            'PNG',
            imgX,
            imgY,
            img.width * ratio,
            img.height * ratio
        );

        pdf.save(`${filename}_${new Date().toISOString().slice(0, 10)}.pdf`);
        console.log('PDF exporté avec succès');
    } catch (error) {
        console.error('Erreur lors de l\'export en PDF:', error);
        throw error;
    }
};

export const formatFilename = (title?: string): string => {
    if (!title) return 'chart';
    return title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '_')
        .replace(/^_+|_+$/g, '')
        .slice(0, 50);
};