import { useQuery } from "@tanstack/react-query";
import { getStudentTimeline } from "../../services/studentService";
import { useMemo } from "react";
import type { TimelineItem } from "../../types/student";

const groupItemsByMonth = (items: TimelineItem[] = []) => {
  return items.reduce((acc, item) => {
    const monthYear = new Date(item.date + "T00:00:00").toLocaleString(
      "pt-BR",
      { month: "long", year: "numeric" }
    );
    if (!acc[monthYear]) {
      acc[monthYear] = [];
    }
    acc[monthYear].push(item);
    return acc;
  }, {} as Record<string, TimelineItem[]>);
};

export function useStudentTimeline(studentId: string) {
  const { data: timelineItems, ...queryInfo } = useQuery({
    queryKey: ["studentTimeline", studentId],
    queryFn: () => getStudentTimeline(studentId),
    enabled: !!studentId,
  });

  const groupedTimeline = useMemo(
    () => groupItemsByMonth(timelineItems),
    [timelineItems]
  );

  return { groupedTimeline, ...queryInfo };
}
