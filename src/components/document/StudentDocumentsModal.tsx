import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getDocuments, uploadDocument, deleteDocument, downloadDocument, viewDocument } from '../../services/documentService';
import type { Student } from '../../types/student';
import Button from '../ui/Button';
import Input from '../ui/Input';
import { LoaderCircle, AlertTriangle, Upload, Download, Trash2, Eye } from 'lucide-react';

type Props = {
  student: Student;
  onClose: () => void;
};

export default function StudentDocumentsModal({ student, onClose }: Props) {
  const queryClient = useQueryClient();
  const [file, setFile] = useState<File | null>(null);
  const [documentType, setDocumentType] = useState('');
  
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

  return (
    <div className="space-y-6">
      <form onSubmit={handleSubmit} className="p-4 border rounded-lg space-y-4 bg-gray-50">
        <h3 className="font-semibold text-lg">Adicionar novo documento</h3>
        <div className="grid md:grid-cols-2 gap-4">
          <Input
            id="documentType"
            label="Tipo do Documento"
            type="text"
            placeholder="Ex: RG, CPF, Atestado"
            value={documentType}
            onChange={(e) => setDocumentType(e.target.value)}
          />
          <Input
            id="fileUpload"
            label="Selecionar Arquivo"
            type="file"
            onChange={handleFileChange}
          />
        </div>
        <Button type="submit" loading={uploadMutation.isPending} className="w-full">
          <Upload className="h-4 w-4 mr-2" />
          Enviar Documento
        </Button>
      </form>

      <div className="space-y-4">
        <h3 className="font-semibold text-lg border-t pt-4">Documentos Anexados</h3>
        {isLoading && <div className="flex justify-center p-4"><LoaderCircle className="animate-spin" /></div>}
        {isError && <div className="text-red-500"><AlertTriangle className="inline-block mr-2"/>Erro ao carregar documentos.</div>}
        {documents && documents.length > 0 ? (
          <ul className="space-y-4">
            {documents.map((doc) => (
              <li key={doc.id} className="border rounded-lg p-3 shadow-sm flex items-center justify-between">
                <div>
                  <p className="font-medium">{doc.fileName}</p>
                  <p className="text-sm text-gray-600">
                    {doc.documentType} - {new Date(doc.attachmentDate).toLocaleDateString()}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <Button onClick={() => viewDocument(student.id, doc.id)} variant="outline" title="Visualizar documento">
                    <Eye className="h-4 w-4" />
                  </Button>
                  <Button onClick={() => downloadDocument(student.id, doc.id, doc.fileName)} variant="outline" title="Baixar documento">
                    <Download className="h-4 w-4" />
                  </Button>
                  <Button
                    onClick={() => deleteMutation.mutate(doc.id)}
                    variant="danger"
                    title="Excluir documento"
                    loading={deleteMutation.isPending && deleteMutation.variables === doc.id}
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