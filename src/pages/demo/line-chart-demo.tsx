import {HeaderElement} from "@/components/ui/header/header-element.tsx";
import {ChartLine} from "lucide-react";
import {LineChart} from "@/components/ui/dashboard/line-chart.tsx";

export function LineChartDemo() {
    const header = {
        icon: ChartLine,
        title: "Line chart",
        subtitle: "Visualisation graphique de données."
    };

    const data_ls = [
        { label: 'Jan', value: 120 },
        { label: 'Fév', value: 200 },
        { label: 'Mar', value: 150 },
        { label: 'Avr', value: 280 },
        { label: 'Mai', value: 180 },
        { label: 'Juin', value: 320 }
    ];

    const data_as = [
        { label: 'Lun', value: 45 },
        { label: 'Mar', value: 78 },
        { label: 'Mer', value: 62 },
        { label: 'Jeu', value: 95 },
        { label: 'Ven', value: 120 },
        { label: 'Sam', value: 85 },
        { label: 'Dim', value: 60 }
    ];

    const data_mls = [
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

    const data_mas = [
        {
            name: 'Mobile',
            color: '#8B5CF6',
            data: [
                { label: 'Jan', value: 45 },
                { label: 'Fév', value: 55 },
                { label: 'Mar', value: 70 },
                { label: 'Avr', value: 85 }
            ]
        },
        {
            name: 'Desktop',
            color: '#10B981',
            data: [
                { label: 'Jan', value: 80 },
                { label: 'Fév', value: 75 },
                { label: 'Mar', value: 90 },
                { label: 'Avr', value: 95 }
            ]
        },
        {
            name: 'Tablette',
            color: '#F59E0B',
            data: [
                { label: 'Jan', value: 20 },
                { label: 'Fév', value: 30 },
                { label: 'Mar', value: 35 },
                { label: 'Avr', value: 45 }
            ]
        }
    ];

    const data_formatted = [
        { label: 'Jan', value: 1250000 },
        { label: 'Fév', value: 2100000 },
        { label: 'Mar', value: 1850000 },
        { label: 'Avr', value: 2950000 }
    ];
    return (
        <div className="w-full h-auto bg-white p-5 flex flex-col gap-3 rounded-lg">
            <HeaderElement header={header} />
            <div className="grid grid-cols-1 md:grid md:grid-cols-2 gap-4 place-items-center">
                <LineChart
                    title="Évolution des ventes"
                    subtitle="Année 2026"
                    data={data_ls}
                    type="line"
                    smooth
                    showDots
                    exportable
                />

                <LineChart
                    title="Trafic hebdomadaire"
                    data={data_as}
                    type="area"
                    smooth
                    showDots
                />

                <LineChart
                    title="Comparaison annuelle"
                    subtitle="Revenus par trimestre"
                    data={data_mls}
                    type="line"
                    smooth
                    showLegend
                    exportable
                />

                <LineChart
                    title="Trafic par appareil"
                    data={data_mas}
                    type="area"
                    smooth
                    showLegend
                />

                <LineChart
                    title="Chiffre d'affaires"
                    data={data_formatted}
                    type="area"
                    smooth
                    showValues
                    valueFormatter={(v) => `${(v / 1000000).toFixed(1)}M`}
                />
            </div>
        </div>
    );
}