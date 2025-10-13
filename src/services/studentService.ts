import api from "../lib/http";
import type {
  CreateStudentDTO,
  Student,
  UpdateStudentDTO,
  StudentSummary,
  Page,
  GetStudentsParams,
  TimelineItem,
} from "../types/student";

export async function getStudents(
  params: GetStudentsParams
): Promise<Page<StudentSummary>> {
  const { data } = await api.get<Page<StudentSummary>>("/students", {
    params: {
      page: params.page ?? 0,
      size: params.size ?? 10,
      query: params.query,
      status: params.status,
    },
  });
  return data;
}

export async function getStudentById(id: string): Promise<Student> {
  const { data } = await api.get<Student>(`/students/${id}`);
  return data;
}

export async function createStudent(
  payload: CreateStudentDTO
): Promise<Student> {
  const { data } = await api.post<Student>("/students", payload);
  return data;
}

export async function updateStudent(
  id: string,
  payload: UpdateStudentDTO
): Promise<Student> {
  const { data } = await api.put<Student>(`/students/${id}`, payload);
  return data;
}

export async function deleteStudent(id: string): Promise<void> {
  await api.delete(`/students/${id}`);
}

export async function getStudentTimeline(
  studentId: string
): Promise<TimelineItem[]> {
  const { data } = await api.get<TimelineItem[]>(
    `/students/${studentId}/timeline`
  );
  return data;
}

export async function getStudentMe(): Promise<Student> {
  const { data } = await api.get<Student>("/students/me");
  return data;
}
