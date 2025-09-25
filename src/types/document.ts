export type Document = {
  id: string;
  fileName: string;
  documentType: string;
  attachmentDate: string;
  pathFile: string;
};

export type StagedFile = {
  id: string;
  file: File;
  progress: number;
  error?: string;
};
