import { AlertTriangle, LoaderCircle } from "lucide-react";
import { useHomePageData } from "../../hooks/useHomePageData";
import { DashboardStats } from "../../components/dashboard/DashboardStats";
import DashboardChart from "../../components/dashboard/DashboardChart";
import StudentStatusChart from '../../components/dashboard/StudentStatusChart';

export default function HomePage() {
    const { dashboardData, monthlyEvolutionData, studentStatusData, isLoading, isError } = useHomePageData();

    if (isLoading) {
        return (
            <div className="flex items-center justify-center p-10">
                <LoaderCircle className="h-8 w-8 animate-spin text-ifpr-green" />
                <p className="ml-2 text-gray-600">Carregando painel...</p>
            </div>
        );
    }

    if (isError || !dashboardData || !monthlyEvolutionData || !studentStatusData) {
        return (
            <div className="text-red-600 flex flex-col items-center gap-4 p-8 bg-red-50 border-red-200 rounded-xl">
                <AlertTriangle className="h-10 w-10" />
                <p className="font-semibold text-xl">Erro ao carregar os dados do painel.</p>
                <p>Por favor, tente recarregar a página ou contate o suporte.</p>
            </div>
        );
    }

    const chartData = monthlyEvolutionData.map(item => ({
        name: item.month,
        atendimentos: item.atendimentosCount,
        acompanhamentos: item.acompanhamentosCount,
    }));

    const studentChartData = studentStatusData.map(item => ({
        status: item.status,
        count: item.count,
    }));
    return (
        <div className="p-8 space-y-8">
            <div>
                <h1 className="text-2xl font-bold text-gray-900">Painel de Controle</h1>
                <p className="text-gray-600 mt-1">
                    Acompanhe os principais indicadores do CNAPNE.
                </p>
            </div>

            <DashboardStats data={dashboardData} />

            <div className="grid grid-cols-1 gap-8">
                <DashboardChart data={chartData} />
                <StudentStatusChart data={studentChartData} />
            </div>

        </div>
    );
}