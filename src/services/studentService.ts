import api from '../lib/http';
import type { Student } from '../types/student';

// A função usa o tipo Student[] para garantir que a resposta da API
// corresponda ao que esperamos.
export async function getAllStudents(): Promise<Student[]> {
  const { data } = await api.get<Student[]>('/students');
  return data;
}

// Futuramente, você pode adicionar outras funções aqui:
// export async function createStudent(payload: CreateStudentDTO) { ... }
// export async function deleteStudent(id: string) { ... }