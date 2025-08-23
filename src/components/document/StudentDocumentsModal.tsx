import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getDocuments, uploadDocument, deleteDocument, downloadDocument } from '../../services/documentService';
import { type Document } from '../../types/document';
import type { Student } from '../../types/student';
import Button from '../ui/Button';
import Input from '../ui/Input';
import { LoaderCircle, AlertTriangle, Upload, Download, Trash2, FileText } from 'lucide-react';

type Props = {
  student: Student;
  onClose: () => void;
};

export default function StudentDocumentsModal({ student, onClose }: Props) {
  const queryClient = useQueryClient();
  const [file, setFile] = useState<File | null>(null);
  const [documentType, setDocumentType] = useState('');
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const { data: documents, isLoading, isError } = useQuery({
    queryKey: ['documents', student.id],
    queryFn: () => getDocuments(student.id),
  });

  const uploadMutation = useMutation({
    mutationFn: () => uploadDocument(student.id, file!, documentType),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['documents', student.id] });
      setFile(null);
      setDocumentType('');
      const fileInput = document.getElementById('fileUpload') as HTMLInputElement;
      if (fileInput) fileInput.value = '';
    },
    onError: (err: any) => alert(`Erro no upload: ${err.message}`),
  });

  const deleteMutation = useMutation({
    mutationFn: (docId: string) => deleteDocument(student.id, docId),
    onMutate: (docId) => setDeletingId(docId),
    onSettled: () => setDeletingId(null),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['documents', student.id] }),
    onError: (err: any) => alert(`Erro ao deletar: ${err.message}`),
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) setFile(e.target.files[0]);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (file && documentType) {
      uploadMutation.mutate();
    } else {
      alert('Por favor, selecione um arquivo e digite o tipo do documento.');
    }
  };

  const handleDownload = async (doc: Document) => {
    try {
      await downloadDocument(student.id, doc.id, doc.fileName);
    } catch (err: any) {
      alert(`Erro ao baixar: ${err.message}`);
    }
  };

  return (
    <div className="space-y-6 bg-white p-6 rounded-2xl shadow-md w-full max-w-3xl">
      <h2 className="text-2xl font-bold text-ifpr-black">
        Documentos de <span className="text-ifpr-green">{student.completeName}</span>
      </h2>

      {/* Formulário de Upload */}
      <form onSubmit={handleSubmit} className="p-4 border rounded-lg space-y-4">
        <h3 className="font-semibold text-lg">Adicionar novo documento</h3>
        <div className="flex items-center gap-4">
          <Input
            id="documentType"
            label="Tipo do Documento"
            type="text"
            placeholder="Ex: RG, CPF, Atestado"
            value={documentType}
            onChange={(e) => setDocumentType(e.target.value)}
            className="flex-grow"
          />
          <Input
            id="fileUpload"
            label="Selecionar Arquivo"
            type="file"
            onChange={handleFileChange}
            className="flex-grow"
          />
        </div>
        <Button type="submit" loading={uploadMutation.isPending} className="w-full" disabled={uploadMutation.isPending}>
          <Upload className="h-4 w-4 mr-2" />
          Enviar Documento
        </Button>
      </form>

      {/* Lista de Documentos */}
      <div className="space-y-2">
        <h3 className="font-semibold text-lg border-t pt-4">Documentos Anexados</h3>
        {isLoading && <div className="flex justify-center p-4"><LoaderCircle className="animate-spin" /></div>}
        {isError && <div className="text-red-500"><AlertTriangle className="inline-block mr-2"/>Erro ao carregar documentos.</div>}
        {documents && documents.length > 0 ? (
          <ul className="divide-y">
            {documents.map((doc) => (
              <li key={doc.id} className="flex items-center justify-between py-3">
                <div className="flex items-center gap-3">
                  <FileText className="h-5 w-5 text-gray-500" />
                  <div>
                    <p className="font-medium">{doc.fileName}</p>
                    <p className="text-sm text-gray-600">{doc.documentType} - {new Date(doc.attachmentDate).toLocaleDateString()}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Button onClick={() => handleDownload(doc)} variant="outline" title="Baixar documento">
                    <Download className="h-4 w-4" />
                  </Button>
                  <Button
                    onClick={() => deleteMutation.mutate(doc.id)}
                    variant="danger"
                    title="Excluir documento"
                    loading={deletingId === doc.id}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          !isLoading && <p className="text-gray-500 text-center py-4">Nenhum documento encontrado.</p>
        )}
      </div>

      <div className="flex justify-end gap-4 pt-4 border-t">
        <Button onClick={onClose} variant="secondary">
          Fechar
        </Button>
      </div>
    </div>
  );
}
