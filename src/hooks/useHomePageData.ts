// src/hooks/useHomePageData.ts

import { useQuery } from "@tanstack/react-query";
import {
  getDashboardData,
  getMonthlyEvolutionData,
  getStudentStatusData,
} from "../services/dashboardService";
import { useAuth } from "../store/auth";
import type {
  DashboardData,
  MonthlyData,
  StudentStatusData,
} from "../types/dashboard";

export function useHomePageData() {
  const { session } = useAuth();

  const {
    data: dashboardData,
    isLoading: isLoadingStats,
    isError: isErrorStats,
  } = useQuery<DashboardData>({
    queryKey: ["dashboardStats", session?.role],
    queryFn: getDashboardData,
  });

  const {
    data: monthlyEvolutionData,
    isLoading: isLoadingChart,
    isError: isErrorChart,
  } = useQuery<MonthlyData[]>({
    queryKey: ["dashboardChart", session?.role],
    queryFn: getMonthlyEvolutionData,
  });

  const {
    data: studentStatusData,
    isLoading: isLoadingStatusChart,
    isError: isErrorStatusChart,
  } = useQuery<StudentStatusData[]>({
    queryKey: ["studentStatusChart"],
    queryFn: getStudentStatusData,
  });

  return {
    dashboardData,
    monthlyEvolutionData,
    studentStatusData,
    isLoading: isLoadingStats || isLoadingChart || isLoadingStatusChart,
    isError: isErrorStats || isErrorChart || isErrorStatusChart,
  };
}
