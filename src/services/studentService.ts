import api from '../lib/http';
import type { CreateStudentDTO, Student, UpdateStudentDTO, StudentSummary } from '../types/student';

export async function getAllStudents(): Promise<Student[]> {
  const { data } = await api.get<Student[]>('/students');
  return data;
}

export async function getStudentById(id: string): Promise<Student> {
  const { data } = await api.get<Student>(`/students/${id}`);
  return data;
}

export async function createStudent(payload: CreateStudentDTO): Promise<Student> {
  const { data } = await api.post<Student>('/students', payload);
  return data;
}

export async function updateStudent(id: string, payload: UpdateStudentDTO): Promise<Student> {
  const { data } = await api.put<Student>(`/students/${id}`, payload);
  return data;

}
export async function deleteStudent(id: string): Promise<void> {
  await api.delete(`/students/${id}`);
}

export async function searchStudents(query: string): Promise<StudentSummary[]> {
  const { data } = await api.get<StudentSummary[]>('/students/search', { // Use StudentSummary[] aqui
    params: { query },
  });
  return data;
}