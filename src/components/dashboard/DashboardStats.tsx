import { ClipboardCheck, ClipboardList, CalendarClock, CheckCircle, XCircle } from "lucide-react";
import { type DashboardData } from "../../types/dashboard"; // Importe a interface de dados
import { DashboardCard } from "./DashboardCard";

interface DashboardStatsProps {
    data: DashboardData;
}

export function DashboardStats({ data }: DashboardStatsProps) {
    return (
        <div className="space-y-8">
            <div>
                <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
                    <ClipboardList className="h-6 w-6 text-ifpr-green" />
                    Atendimentos
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <DashboardCard
                        title="Total"
                        value={data.totalAtendimentos}
                        icon={<ClipboardList className="h-6 w-6 text-ifpr-green" />}
                        color="bg-ifpr-green/10"
                    />
                    <DashboardCard
                        title="Agendados"
                        value={data.atendimentosAgendados}
                        icon={<CalendarClock className="h-6 w-6 text-amber-500" />}
                        color="bg-amber-100"
                    />
                    <DashboardCard
                        title="Realizados"
                        value={data.atendimentosRealizados}
                        icon={<CheckCircle className="h-6 w-6 text-emerald-500" />}
                        color="bg-emerald-100"
                    />
                    <DashboardCard
                        title="Cancelados"
                        value={data.atendimentosCancelados}
                        icon={<XCircle className="h-6 w-6 text-red-500" />}
                        color="bg-red-100"
                    />
                </div>
            </div>

            <div>
                <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
                    <ClipboardCheck className="h-6 w-6 text-blue-500" />
                    Acompanhamentos
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <DashboardCard
                        title="Total"
                        value={data.totalAcompanhamentos}
                        icon={<ClipboardCheck className="h-6 w-6 text-blue-500" />}
                        color="bg-blue-100"
                    />
                    <DashboardCard
                        title="Agendados"
                        value={data.acompanhamentosAgendados}
                        icon={<CalendarClock className="h-6 w-6 text-amber-500" />}
                        color="bg-amber-100"
                    />
                    <DashboardCard
                        title="Realizados"
                        value={data.acompanhamentosRealizados}
                        icon={<CheckCircle className="h-6 w-6 text-emerald-500" />}
                        color="bg-emerald-100"
                    />
                    <DashboardCard
                        title="Cancelados"
                        value={data.acompanhamentosCancelados}
                        icon={<XCircle className="h-6 w-6 text-red-500" />}
                        color="bg-red-100"
                    />
                </div>
            </div>
        </div>
    );
}