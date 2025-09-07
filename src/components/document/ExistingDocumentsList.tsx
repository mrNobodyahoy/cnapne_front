import type { Document } from "../../types/document";
import type { UseMutationResult } from "@tanstack/react-query";
import DocumentCard from "./DocumentCard";
import { LoaderCircle, AlertTriangle } from "lucide-react";

type Props = {
    documents: Document[] | undefined;
    isLoading: boolean;
    isError: boolean;
    studentId: string;
    deleteMutation: UseMutationResult<any, any, string, any>;
};

export default function ExistingDocumentsList({ documents, isLoading, isError, studentId, deleteMutation }: Props) {
    return (
        <div className="space-y-4">
            <h3 className="font-semibold text-lg border-t pt-6">Documentos Anexados</h3>
            {isLoading && <div className="flex justify-center p-4"><LoaderCircle className="animate-spin" /></div>}
            {isError && <div className="text-red-500"><AlertTriangle className="inline-block mr-2" />Erro ao carregar documentos.</div>}
            {documents && documents.length > 0 ? (
                <div className="grid md:grid-cols-2 gap-4">
                    {documents.map((doc) => (
                        <DocumentCard
                            key={doc.id}
                            doc={doc}
                            studentId={studentId}
                            onDelete={() => deleteMutation.mutate(doc.id)}
                            isDeleting={deleteMutation.isPending && deleteMutation.variables === doc.id}
                        />
                    ))}
                </div>
            ) : (!isLoading && <p className="text-gray-500 text-center py-4">Nenhum documento encontrado.</p>)}
        </div>
    );
}