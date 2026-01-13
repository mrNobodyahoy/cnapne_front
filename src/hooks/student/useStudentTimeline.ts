// src/hooks/student/useStudentTimeline.ts

import { useQuery, type UseQueryResult } from "@tanstack/react-query";
import { getStudentTimeline } from "../../services/studentService";
import { useMemo } from "react";
import type { TimelineItem } from "../../types/student";

// Define o tipo do objeto agrupado
type GroupedTimeline = Record<string, TimelineItem[]>;

// Define o tipo de retorno do hook
type UseStudentTimelineReturn = Omit<
  UseQueryResult<TimelineItem[], Error>,
  "data"
> & {
  groupedTimeline: GroupedTimeline;
};

const groupItemsByMonth = (items: TimelineItem[] = []): GroupedTimeline => {
  // Ordena os itens do mais novo para o mais antigo antes de agrupar
  const sortedItems = [...items].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  return sortedItems.reduce((acc, item) => {
    // A data precisa estar no formato 'AAAA-MM-DD'
    const monthYear = new Date(item.date + "T00:00:00").toLocaleString(
      "pt-BR",
      {
        month: "long",
        year: "numeric",
      }
    );
    if (!acc[monthYear]) {
      acc[monthYear] = [];
    }
    acc[monthYear].push(item);
    return acc;
  }, {} as GroupedTimeline); // Define o tipo inicial do 'reduce'
};

// Adiciona o tipo de retorno explícito aqui
export default function useStudentTimeline(
  studentId: string
): UseStudentTimelineReturn {
  const { data: timelineItems, ...queryInfo } = useQuery<TimelineItem[], Error>(
    {
      queryKey: ["studentTimeline", studentId],
      queryFn: () => getStudentTimeline(studentId),
      enabled: !!studentId,
    }
  );

  const groupedTimeline = useMemo(
    () => groupItemsByMonth(timelineItems),
    [timelineItems]
  );

  return { groupedTimeline, ...queryInfo };
}
