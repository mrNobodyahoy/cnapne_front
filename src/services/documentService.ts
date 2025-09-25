import api from "../lib/http";
import { type Document } from "../types/document";

export async function getDocuments(studentId: string): Promise<Document[]> {
  const { data } = await api.get<Document[]>(
    `/students/${studentId}/documents`
  );
  return data;
}

export const uploadDocument = (
  studentId: string,
  file: File,
  documentType: string,
  onUploadProgress: (progressEvent: any) => void
) => {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("type", documentType);

  return api.post(`/students/${studentId}/documents`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
    onUploadProgress,
  });
};

export async function deleteDocument(
  studentId: string,
  docId: string
): Promise<void> {
  await api.delete(`/students/${studentId}/documents/${docId}`);
}

export async function viewDocument(
  studentId: string,
  docId: string
): Promise<void> {
  const response = await api.get(`/students/${studentId}/documents/${docId}`, {
    params: { disposition: "inline" },
    responseType: "blob",
  });

  const contentType = response.headers["content-type"];
  const fileURL = URL.createObjectURL(response.data);

  if (
    contentType.includes("application/pdf") ||
    contentType.startsWith("image/")
  ) {
    window.open(fileURL, "_blank");
  } else if (
    contentType.includes("application/vnd.openxmlformats-officedocument") ||
    contentType.includes("application/msword") ||
    contentType.includes("application/vnd.ms-excel") ||
    contentType.includes("application/vnd.ms-powerpoint")
  ) {
    const blobUrl = URL.createObjectURL(response.data);
    const googleViewer = `https://docs.google.com/viewer?url=${encodeURIComponent(
      blobUrl
    )}&embedded=true`;
    window.open(googleViewer, "_blank");
  } else {
    const link = document.createElement("a");
    link.href = fileURL;
    link.download = "documento";
    link.click();
  }
}

export async function downloadDocument(
  studentId: string,
  docId: string,
  fileName: string
): Promise<void> {
  const response = await api.get(`/students/${studentId}/documents/${docId}`, {
    params: { disposition: "attachment" },
    responseType: "blob",
  });

  const url = window.URL.createObjectURL(new Blob([response.data]));
  const link = document.createElement("a");
  link.href = url;
  link.setAttribute("download", fileName);
  document.body.appendChild(link);
  link.click();
  link.remove();
}
