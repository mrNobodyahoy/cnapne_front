import { useState, useCallback } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useDropzone } from "react-dropzone";
import toast from "react-hot-toast";

import {
  getDocuments,
  uploadDocument,
  deleteDocument,
} from "../../services/documentService";
import type { StagedFile } from "../../types/document";

export function useStudentDocuments(studentId: string) {
  const queryClient = useQueryClient();
  const [stagedFiles, setStagedFiles] = useState<StagedFile[]>([]);
  const [documentType, setDocumentType] = useState("");

  const {
    data: documents,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["documents", studentId],
    queryFn: () => getDocuments(studentId),
  });

  const deleteMutation = useMutation({
    mutationFn: (docId: string) => deleteDocument(studentId, docId),
    onSuccess: () => {
      toast.success("Documento excluído com sucesso!");
      queryClient.invalidateQueries({ queryKey: ["documents", studentId] });
    },
    onError: (err: any) => toast.error(`Erro ao deletar: ${err.message}`),
  });

  const uploadMutation = useMutation({
    mutationFn: ({
      stagedFile,
      type,
    }: {
      stagedFile: StagedFile;
      type: string;
    }) => {
      return uploadDocument(
        studentId,
        stagedFile.file,
        type,
        (progressEvent) => {
          const percentCompleted = Math.round(
            (progressEvent.loaded * 100) / (progressEvent.total ?? 1)
          );
          setStagedFiles((prev) =>
            prev.map((f) =>
              f.id === stagedFile.id ? { ...f, progress: percentCompleted } : f
            )
          );
        }
      );
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["documents", studentId] });
      toast.success(`"${variables.stagedFile.file.name}" enviado com sucesso!`);
      setTimeout(() => {
        setStagedFiles((prev) =>
          prev.filter((f) => f.id !== variables.stagedFile.id)
        );
      }, 1500);
    },
    onError: (err: any, variables) => {
      setStagedFiles((prev) =>
        prev.map((f) =>
          f.id === variables.stagedFile.id
            ? { ...f, error: err.message, progress: -1 }
            : f
        )
      );
      toast.error(`Falha ao enviar "${variables.stagedFile.file.name}"`);
    },
  });

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const newFiles: StagedFile[] = acceptedFiles.map((file) => ({
      id: `${file.name}-${Date.now()}`,
      file,
      progress: 0,
    }));
    setStagedFiles((prev) => [...prev, ...newFiles]);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    maxSize: 10485760,
    onDropRejected: (fileRejections) => {
      fileRejections.forEach(({ file, errors }) => {
        errors.forEach((error) => {
          toast.error(
            error.code === "file-too-large"
              ? `Arquivo "${file.name}" é grande demais (Max: 10MB).`
              : `Erro com "${file.name}": ${error.message}`
          );
        });
      });
    },
  });

  const handleUploadAll = () => {
    if (!documentType.trim()) {
      toast.error("Por favor, defina um tipo de documento antes de enviar.");
      return;
    }
    stagedFiles.forEach((file) => {
      if (file.progress === 0 && !file.error) {
        uploadMutation.mutate({ stagedFile: file, type: documentType });
      }
    });
    setDocumentType("");
  };

  const removeStagedFile = (id: string) => {
    setStagedFiles((prev) => prev.filter((f) => f.id !== id));
  };

  return {
    documents,
    isLoading,
    isError,
    deleteMutation,
    stagedFiles,
    documentType,
    setDocumentType,
    handleUploadAll,
    removeStagedFile,
    uploadMutationIsPending: uploadMutation.isPending,
    dropzone: { getRootProps, getInputProps, isDragActive },
  };
}
