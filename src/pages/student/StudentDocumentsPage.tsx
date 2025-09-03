import { useQuery } from '@tanstack/react-query';
import { getDocuments, viewDocument, downloadDocument } from '../../services/documentService';
import { getStudentMe } from '../../services/studentService';

import Button from '../../components/ui/Button';
import { LoaderCircle, AlertTriangle, Download, Eye } from 'lucide-react';

export default function StudentDocumentsPage() {
  const { data: student } = useQuery({
    queryKey: ['student-profile-me'],
    queryFn: getStudentMe,
  });

  const { data: documents, isLoading, isError } = useQuery({
    queryKey: ['documents', student?.id],
    queryFn: () => getDocuments(student!.id),
    enabled: !!student, 
  });

  if (isLoading) {
    return (
      <div className="flex justify-center p-8">
        <LoaderCircle className="animate-spin text-ifpr-green h-8 w-8" />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="text-red-600 flex flex-col items-center gap-4 p-8">
        <AlertTriangle className="h-10 w-10"/>
        <p className="font-semibold">Erro ao carregar documentos.</p>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Meus Documentos</h1>
        <p className="mt-1 text-gray-600">Visualize e baixe os documentos anexados ao seu perfil.</p>
      </div>

      <div className="space-y-4 border-t pt-6">
        {documents && documents.length > 0 ? (
          <ul className="space-y-4">
            {documents.map((doc) => (
              <li key={doc.id} className="border rounded-lg p-4 shadow-sm flex items-center justify-between bg-white">
                <div>
                  <p className="font-medium text-gray-800">{doc.fileName}</p>
                  <p className="text-sm text-gray-600">
                    {doc.documentType} - {new Date(doc.attachmentDate).toLocaleDateString('pt-BR')}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <Button 
                    onClick={() => viewDocument(student!.id, doc.id)} 
                    variant="outline" 
                    title="Visualizar documento"
                  >
                    <Eye className="h-4 w-4" />
                  </Button>
                  <Button 
                    onClick={() => downloadDocument(student!.id, doc.id, doc.fileName)} 
                    variant="outline" 
                    title="Baixar documento"
                  >
                    <Download className="h-4 w-4" />
                  </Button>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-500 text-center py-8">Nenhum documento encontrado.</p>
        )}
      </div>
    </div>
  );
}