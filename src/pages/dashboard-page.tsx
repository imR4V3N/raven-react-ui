import {BarChartDemo} from "@/pages/demo/bar-chart-demo.tsx";
import {KpiDemo} from "@/pages/demo/kpi-demo.tsx";
import {LineChartDemo} from "@/pages/demo/line-chart-demo.tsx";
import {PieChartDemo} from "@/pages/demo/pie-chart-demo.tsx";

export function DashboardPage() {
    return (
        <>
            <KpiDemo />
            <BarChartDemo />
            <LineChartDemo />
            <PieChartDemo />
        </>
    )
}