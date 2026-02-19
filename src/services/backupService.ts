import api from "../lib/http";
import type { BackupLog } from "../types/backup";

export async function getBackups(): Promise<BackupLog[]> {
  const { data } = await api.get<BackupLog[]>("/backups");
  return data;
}

export async function createManualBackup(): Promise<BackupLog> {
  const { data } = await api.post<BackupLog>("/backups/manual");
  return data;
}

export async function downloadBackup(nomeArquivo: string): Promise<void> {
  const response = await api.get(`/backups/download/${nomeArquivo}`, {
    responseType: "blob",
  });

  const url = window.URL.createObjectURL(new Blob([response.data]));
  const link = document.createElement("a");
  link.href = url;
  link.setAttribute("download", nomeArquivo);
  document.body.appendChild(link);
  link.click();
  link.remove();
  window.URL.revokeObjectURL(url);
}
export async function uploadRestoreBackup(file: File): Promise<string> {
  const formData = new FormData();
  formData.append("file", file);

  const { data } = await api.post<string>("/backups/restore", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return data;
}
