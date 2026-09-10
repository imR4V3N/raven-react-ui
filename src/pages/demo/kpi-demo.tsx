import {KpiCard} from "@/components/ui/dashboard/kpi-card.tsx";
import {DollarSign, Euro, Package, User, Table} from "lucide-react";
import {HeaderElement} from "@/components/ui/header/header-element.tsx";

export function KpiDemo() {
    const header = {
        icon: Table,
        title: "KPIs",
        subtitle: "Vue d'ensemble des indicateurs clés de performance",
        isExpanded: false
    }

    return (
        <div className="flex flex-col bg-white p-4 rounded-lg gap-3">
            <HeaderElement header={header} />
            <div className="grid grid-cols-1 gap-4 md:grid md:grid-cols-3 md:grid-cols-4">
                <KpiCard
                    title="PRIX × QUANTITÉ"
                    value={9}
                    unit="Ar"
                    description="Valeur totale stock"
                    icon={DollarSign}
                    change={8.2}
                    changeType="increase"
                />

                <KpiCard
                    title="Total Utilisateurs"
                    value={1542}
                    unit="Personnes"
                    description="Inscrits ce mois"
                    icon={User}
                />

                <KpiCard
                    title="PRODUITS EN STOCK"
                    value={1247}
                    icon={Package}
                    description="Disponibles"
                    change={-3.5}
                    changeType="decrease"
                />

                <KpiCard
                    title="Revenus"
                    value={25480}
                    unit="€"
                    description="Mensuels"
                    icon={Euro}
                    change={5.2}
                    changeType="increase"
                    subtitle="+1.2% par rapport au mois dernier"
                />
            </div>
        </div>
    )
}