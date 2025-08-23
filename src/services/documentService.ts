import api from '../lib/http';
import { type Document } from '../types/document';

export async function getDocuments(studentId: string): Promise<Document[]> {
  const { data } = await api.get<Document[]>(`/students/${studentId}/documents`);
  return data;
}

export async function uploadDocument(studentId: string, file: File, type: string): Promise<Document> {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('type', type);

  const { data } = await api.post<Document>(`/students/${studentId}/documents`, formData);
  return data;
}

export async function deleteDocument(studentId: string, docId: string): Promise<void> {
  await api.delete(`/students/${studentId}/documents/${docId}`);
}

export async function downloadDocument(studentId: string, docId: string, fileName: string): Promise<void> {
  const response = await api.get(`/students/${studentId}/documents/${docId}`, {
    responseType: 'blob',
  });

  const url = window.URL.createObjectURL(new Blob([response.data]));
  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', fileName);
  document.body.appendChild(link);
  link.click();
  link.remove();
}
