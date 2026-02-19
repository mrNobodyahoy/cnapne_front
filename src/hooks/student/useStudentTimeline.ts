import { useQuery, type UseQueryResult } from "@tanstack/react-query";
import { getStudentTimeline } from "../../services/studentService";
import { useMemo } from "react";
import type { TimelineItem } from "../../types/student";

type GroupedTimeline = Record<string, TimelineItem[]>;

type UseStudentTimelineReturn = Omit<
  UseQueryResult<TimelineItem[], Error>,
  "data"
> & {
  groupedTimeline: GroupedTimeline;
};

const groupItemsByMonth = (items: TimelineItem[] = []): GroupedTimeline => {
  const sortedItems = [...items].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
  );

  return sortedItems.reduce((acc, item) => {
    const monthYear = new Date(item.date + "T00:00:00").toLocaleString(
      "pt-BR",
      {
        month: "long",
        year: "numeric",
      },
    );
    if (!acc[monthYear]) {
      acc[monthYear] = [];
    }
    acc[monthYear].push(item);
    return acc;
  }, {} as GroupedTimeline);
};

export default function useStudentTimeline(
  studentId: string,
): UseStudentTimelineReturn {
  const { data: timelineItems, ...queryInfo } = useQuery<TimelineItem[], Error>(
    {
      queryKey: ["studentTimeline", studentId],
      queryFn: () => getStudentTimeline(studentId),
      enabled: !!studentId,
    },
  );

  const groupedTimeline = useMemo(
    () => groupItemsByMonth(timelineItems),
    [timelineItems],
  );

  return { groupedTimeline, ...queryInfo };
}
