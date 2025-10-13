export interface DashboardData {
  totalAtendimentos: number;
  atendimentosAgendados: number;
  atendimentosRealizados: number;
  atendimentosCancelados: number;
  totalAcompanhamentos: number;
  acompanhamentosAgendados: number;
  acompanhamentosRealizados: number;
  acompanhamentosCancelados: number;
}
export interface MonthlyData {
  month: string;
  atendimentosCount: number;
  acompanhamentosCount: number;
}

export interface StudentStatusData {
  status: string;
  count: number;
}
