import api from '../lib/http';
import type { CreateStudentDTO, Student } from '../types/student';

// A função usa o tipo Student[] para garantir que a resposta da API
// corresponda ao que esperamos.
export async function getAllStudents(): Promise<Student[]> {
  const { data } = await api.get<Student[]>('/students');
    console.log('Dados retornados pelo serviço:', data);
  return data;
}

export async function createStudent(payload: CreateStudentDTO): Promise<Student> {
  const {data} = await api.post<Student>('/students', payload);
  return data;
}