// src/components/dashboard/DashboardStats.tsx

import { Link } from 'react-router-dom';
import { DashboardCard } from "./DashboardCard";
import type { DashboardData } from "../../types/dashboard";
import { DashboardStatIcon } from '../ui/DashboardStatIcon';

interface Props {
    data: DashboardData;
}

export function DashboardStats({ data }: Props) {
    const colors = {
        total: "bg-blue-100",
        agendados: "bg-yellow-100",
        realizados: "bg-green-100",
        cancelados: "bg-red-100",
    };

    return (
        <div className="space-y-6">
            {/* --- ATENDIMENTOS --- */}
            <div>
                <h2 className="text-lg font-semibold text-gray-800 mb-4">Atendimentos</h2>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">

                    {/* CORREÇÃO AQUI: Use type="total" */}
                    <Link to="/atendimentos">
                        <DashboardCard
                            title="Total"
                            value={data.totalAtendimentos}
                            icon={<DashboardStatIcon type="total" />}
                            color={colors.total}
                        />
                    </Link>

                    {/* CORREÇÃO AQUI: Use type="agendados" */}
                    <Link to="/atendimentos?status=AGENDADO">
                        <DashboardCard
                            title="Agendados"
                            value={data.atendimentosAgendados}
                            icon={<DashboardStatIcon type="agendados" />}
                            color={colors.agendados}
                        />
                    </Link>

                    {/* CORREÇÃO AQUI: Use type="realizados" */}
                    <Link to="/atendimentos?status=REALIZADO">
                        <DashboardCard
                            title="Realizados"
                            value={data.atendimentosRealizados}
                            icon={<DashboardStatIcon type="realizados" />}
                            color={colors.realizados}
                        />
                    </Link>

                    {/* CORREÇÃO AQUI: Use type="cancelados" */}
                    <Link to="/atendimentos?status=CANCELADO">
                        <DashboardCard
                            title="Cancelados"
                            value={data.atendimentosCancelados}
                            icon={<DashboardStatIcon type="cancelados" />}
                            color={colors.cancelados}
                        />
                    </Link>
                </div>
            </div>

            {/* --- ACOMPANHAMENTOS --- */}
            <div>
                <h2 className="text-lg font-semibold text-gray-800 mb-4">Acompanhamentos</h2>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">

                    {/* CORREÇÃO AQUI: Use type="total" */}
                    <Link to="/acompanhamentos">
                        <DashboardCard
                            title="Total"
                            value={data.totalAcompanhamentos}
                            icon={<DashboardStatIcon type="total" />}
                            color={colors.total}
                        />
                    </Link>

                    {/* CORREÇÃO AQUI: Use type="agendados" */}
                    <Link to="/acompanhamentos?status=AGENDADO">
                        <DashboardCard
                            title="Agendados"
                            value={data.acompanhamentosAgendados}
                            icon={<DashboardStatIcon type="agendados" />}
                            color={colors.agendados}
                        />
                    </Link>

                    {/* CORREÇÃO AQUI: Use type="realizados" */}
                    <Link to="/acompanhamentos?status=REALIZADO">
                        <DashboardCard
                            title="Realizados"
                            value={data.acompanhamentosRealizados}
                            icon={<DashboardStatIcon type="realizados" />}
                            color={colors.realizados}
                        />
                    </Link>

                    {/* CORREÇÃO AQUI: Use type="cancelados" */}
                    <Link to="/acompanhamentos?status=CANCELADO">
                        <DashboardCard
                            title="Cancelados"
                            value={data.acompanhamentosCancelados}
                            icon={<DashboardStatIcon type="cancelados" />}
                            color={colors.cancelados}
                        />
                    </Link>
                </div>
            </div>
        </div>
    );
}