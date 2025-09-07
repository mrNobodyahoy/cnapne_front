export type Document = {
  id: string;
  fileName: string;
  documentType: string;
  attachmentDate: string;
  pathFile: string;
};

export type StagedFile = {
  id: string;        // ID único para controle no front-end
  file: File;        // O objeto File real
  progress: number;  // Progresso do upload (0-100, ou -1 para erro)
  error?: string;    // Mensagem de erro, se houver
};