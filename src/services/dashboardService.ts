import api from "../lib/http";
import type {
  DashboardData,
  MonthlyData,
  StudentStatusData,
} from "../types/dashboard";

export async function getDashboardData(): Promise<DashboardData> {
  const { data } = await api.get<DashboardData>("/dashboard");
  return data;
}
export async function getMonthlyEvolutionData(): Promise<MonthlyData[]> {
  const { data } = await api.get<MonthlyData[]>(
    "/dashboard/evolucao-mensal",
    {},
  );
  return data;
}
export async function getStudentStatusData(): Promise<StudentStatusData[]> {
  const { data } = await api.get<StudentStatusData[]>(
    "/dashboard/student-status",
  );
  return data;
}
