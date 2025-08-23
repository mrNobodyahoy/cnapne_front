import api from '../lib/http';
import type { CreateStudentDTO, Student, UpdateStudentDTO } from '../types/student';

export async function getAllStudents(): Promise<Student[]> {
  const { data } = await api.get<Student[]>('/students');
    console.log('Dados retornados pelo serviço:', data);
  return data;
}

export async function createStudent(payload: CreateStudentDTO): Promise<Student> {
  const {data} = await api.post<Student>('/students', payload);
  return data;
}

export async function updateStudent(id: string, payload: UpdateStudentDTO): Promise<Student> {
  const {data} =  await api.put<Student>(`/students/${id}`, payload);
  return data;
  
}
export async function deleteStudent(id: string): Promise<void> {
  await api.delete(`/students/${id}`);
}