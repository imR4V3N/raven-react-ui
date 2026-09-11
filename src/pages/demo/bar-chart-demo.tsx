import {HeaderElement} from "@/components/ui/header/header-element.tsx";
import {ChartBar} from "lucide-react";
import {BarChart} from "@/components/ui/dashboard/bar-chart.tsx";

export function BarChartDemo() {
    const header = {
        icon: ChartBar,
        title: "Bar chart",
        subtitle: "Visuel graphique de données."
    };

    const data_v = [
        { label: 'Jan', value: 120 },
        { label: 'Fév', value: 200 },
        { label: 'Mar', value: 150 },
        { label: 'Avr', value: 280 },
        { label: 'Mai', value: 180 },
        { label: 'Juin', value: 320 }
    ];

    const data_h = [
        { label: 'Produit A', value: 450 },
        { label: 'Produit B', value: 320 },
        { label: 'Produit C', value: 280 },
        { label: 'Produit D', value: 190 }
    ];

    const data_grouped = [
        {
            name: '2025',
            color: '#3B82F6',
            data: [
                { label: 'Q1', value: 120 },
                { label: 'Q2', value: 180 },
                { label: 'Q3', value: 150 },
                { label: 'Q4', value: 220 }
            ]
        },
        {
            name: '2026',
            color: '#10B981',
            data: [
                { label: 'Q1', value: 160 },
                { label: 'Q2', value: 220 },
                { label: 'Q3', value: 190 },
                { label: 'Q4', value: 280 }
            ]
        }
    ];

    const data_stacked_v = [
        {
            name: 'En ligne',
            color: '#3B82F6',
            data: [
                { label: 'Lun', value: 40 },
                { label: 'Mar', value: 55 },
                { label: 'Mer', value: 45 },
                { label: 'Jeu', value: 60 },
                { label: 'Ven', value: 70 }
            ]
        },
        {
            name: 'En magasin',
            color: '#F59E0B',
            data: [
                { label: 'Lun', value: 30 },
                { label: 'Mar', value: 25 },
                { label: 'Mer', value: 35 },
                { label: 'Jeu', value: 40 },
                { label: 'Ven', value: 50 }
            ]
        },
        {
            name: 'Téléphone',
            color: '#10B981',
            data: [
                { label: 'Lun', value: 15 },
                { label: 'Mar', value: 20 },
                { label: 'Mer', value: 18 },
                { label: 'Jeu', value: 22 },
                { label: 'Ven', value: 25 }
            ]
        }
    ];

    const data_stacked_h = [
        {
            name: 'Marketing',
            data: [
                { label: 'Q1', value: 45 },
                { label: 'Q2', value: 55 },
                { label: 'Q3', value: 50 }
            ]
        },
        {
            name: 'R&D',
            data: [
                { label: 'Q1', value: 80 },
                { label: 'Q2', value: 90 },
                { label: 'Q3', value: 85 }
            ]
        },
        {
            name: 'Opérations',
            data: [
                { label: 'Q1', value: 60 },
                { label: 'Q2', value: 65 },
                { label: 'Q3', value: 70 }
            ]
        }
    ];

    const data_formatted = [
        { label: 'Jan', value: 1250000 },
        { label: 'Fév', value: 2100000 },
        { label: 'Mar', value: 1850000 },
        { label: 'Avr', value: 1850000 },
    ];

    return (
        <div className="w-full h-auto bg-white p-5 flex flex-col gap-3 rounded-lg">
            <HeaderElement header={header} />
            <div className="grid grid-cols-1 md:grid md:grid-cols-2 gap-4 place-items-center">
                <BarChart
                    title="Ventes mensuelles"
                    subtitle="Année 2026"
                    data={data_v}
                    direction="vertical"
                    showValues
                    showGrid
                    exportable
                />

                <BarChart
                    title="Ventes par produit"
                    subtitle="Répartition des ventes par catégorie"
                    data={data_h}
                    direction="horizontal"
                    showValues
                />

                <BarChart
                    title="Comparaison annuelle"
                    subtitle="Revenus par trimestre"
                    data={data_grouped}
                    direction="vertical"
                    showValues
                    showLegend
                    exportable
                />

                <BarChart
                    title="Ventes par canal"
                    subtitle="Répartition journalière"
                    data={data_stacked_v}
                    type="stacked"
                    direction="vertical"
                    showValues
                    showLegend
                />

                <BarChart
                    title="Budget par département"
                    subtitle="Répartition du budget par département"
                    data={data_stacked_h}
                    type="stacked"
                    direction="horizontal"
                    showValues
                    showLegend
                />

                <BarChart
                    title="Chiffre d'affaires"
                    data={data_formatted}
                    showValues
                    valueFormatter={(v) => `${(v / 1000000).toFixed(1)}M Ar`}
                />
            </div>
        </div>
    );
}