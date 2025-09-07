import type { Document } from "../../types/document";
import FileIcon from "../ui/FileIcon";
import Button from "../ui/Button";
import { Eye, Download, Trash2 } from "lucide-react";
import { downloadDocument, viewDocument } from "../../services/documentService";

type Props = {
    doc: Document;
    studentId: string;
    onDelete: () => void;
    isDeleting: boolean;
};

export default function DocumentCard({ doc, studentId, onDelete, isDeleting }: Props) {
    return (
        <div className="border rounded-lg p-4 shadow-sm bg-white flex flex-col justify-between">
            <div className="flex items-center gap-3">
                <FileIcon fileName={doc.fileName} />
                <div>
                    <p className="font-medium truncate" title={doc.fileName}>{doc.fileName}</p>
                    <p className="text-sm text-gray-600">{doc.documentType} - {new Date(doc.attachmentDate).toLocaleDateString()}</p>
                </div>
            </div>
            <div className="flex items-center gap-2 mt-3 ml-11">
                <Button onClick={() => viewDocument(studentId, doc.id)} variant="outline" title="Visualizar"><Eye className="h-4 w-4" /></Button>
                <Button onClick={() => downloadDocument(studentId, doc.id, doc.fileName)} variant="outline" title="Baixar"><Download className="h-4 w-4" /></Button>
                <Button onClick={onDelete} variant="danger" title="Excluir" loading={isDeleting}>
                    <Trash2 className="h-4 w-4" />
                </Button>
            </div>
        </div>
    );
}   