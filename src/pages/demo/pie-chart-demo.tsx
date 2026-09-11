import {HeaderElement} from "@/components/ui/header/header-element.tsx";
import {ChartPie} from "lucide-react";
import {PieChart} from "@/components/ui/dashboard/pie-chart.tsx";

export function PieChartDemo() {
    const header = {
        icon: ChartPie,
        title: "Pie chart",
        subtitle: "Visualisation graphique de données."
    };

    const data_sp = [
        { label: 'Chrome', value: 65 },
        { label: 'Safari', value: 18 },
        { label: 'Firefox', value: 10 },
        { label: 'Edge', value: 5 },
        { label: 'Autres', value: 2 }
    ];

    const data_sd = [
        { label: 'Ventes', value: 45000, color: '#3B82F6' },
        { label: 'Marketing', value: 28000, color: '#10B981' },
        { label: 'R&D', value: 35000, color: '#F59E0B' },
        { label: 'Opérations', value: 22000, color: '#EF4444' },
        { label: 'Support', value: 15000, color: '#8B5CF6' }
    ];

    const data_cd = [
        { label: 'Réussi', value: 78 },
        { label: 'Échoué', value: 15 },
        { label: 'En attente', value: 7 }
    ];
    return (
        <div className="w-full h-auto bg-white p-5 flex flex-col gap-3 rounded-lg">
            <HeaderElement header={header} />
            <div className="grid grid-cols-1 md:grid md:grid-cols-2 gap-4 place-items-center">
                <PieChart
                    title="Parts de marché navigateurs"
                    subtitle="2026"
                    data={data_sp}
                    type="pie"
                    showLegend
                    showPercentages
                    exportable
                />

                <PieChart
                    title="Budget 2026"
                    subtitle="Répartition par département"
                    data={data_sd}
                    type="doughnut"
                    thickness={70}
                    showCenterLabel
                    centerLabel="Budget total"
                    valueFormatter={(v) => `${(v / 1000).toFixed(0)}k €`}
                    exportable
                    legendPosition="bottom"
                />

                <PieChart
                    title="Résultats"
                    data={data_cd}
                    type="doughnut"
                    thickness={50}
                    size={180}
                    legendPosition="bottom"
                    showPercentages
                    centerLabel="Taux"
                    centerValue="78%"
                />
            </div>
        </div>
    )
}