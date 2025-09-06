import { useState, useCallback } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useDropzone } from "react-dropzone";
import toast from "react-hot-toast";

import { getDocuments, uploadDocument, deleteDocument, downloadDocument, viewDocument } from "../../services/documentService";
import type { Student } from "../../types/student";
import type { Document } from "../../types/document";

import Button from "../ui/Button";
import Input from "../ui/Input";
import {
    LoaderCircle, AlertTriangle, Download, Trash2, Eye, UploadCloud, X, Upload,
    FileText, FileImage, FileType, FileSpreadsheet, FileArchive, FileBadge,
} from "lucide-react";

// O tipo agora representa um arquivo preparado, em envio, ou com erro.
type StagedFile = {
    id: string;
    file: File;
    progress: number; // 0: aguardando, 1-99: enviando, 100: concluído, -1: erro
    error?: string;
};

type Props = {
    student: Student;
};

// ===============================================
// FUNÇÃO AUXILIAR: Retorna o ícone com base na extensão do arquivo
// ===============================================
const getFileIcon = (fileName: string) => {
    const extension = fileName.split('.').pop()?.toLowerCase();
    switch (extension) {
        case 'pdf':
            return <FileType className="h-8 w-8 text-red-500 flex-shrink-0" />;
        case 'png': case 'jpg': case 'jpeg': case 'gif': case 'webp':
            return <FileImage className="h-8 w-8 text-blue-500 flex-shrink-0" />;
        case 'doc': case 'docx': case 'odt':
            return <FileBadge className="h-8 w-8 text-indigo-500 flex-shrink-0" />;
        case 'xls': case 'xlsx': case 'ods':
            return <FileSpreadsheet className="h-8 w-8 text-green-500 flex-shrink-0" />;
        case 'zip': case 'rar': case '7z':
            return <FileArchive className="h-8 w-8 text-purple-500 flex-shrink-0" />;
        default:
            return <FileText className="h-8 w-8 text-gray-500 flex-shrink-0" />;
    }
};


export default function StudentDocumentsList({ student }: Props) {
    const queryClient = useQueryClient();
    // 1. Estado para guardar os arquivos "preparados" para o upload.
    const [stagedFiles, setStagedFiles] = useState<StagedFile[]>([]);
    const [documentType, setDocumentType] = useState("");

    const { data: documents, isLoading, isError } = useQuery<Document[], Error>({
        queryKey: ["documents", student.id],
        queryFn: () => getDocuments(student.id),
    });

    const deleteMutation = useMutation({
        mutationFn: (docId: string) => deleteDocument(student.id, docId),
        onSuccess: () => {
            toast.success("Documento excluído com sucesso!");
            queryClient.invalidateQueries({ queryKey: ["documents", student.id] });
        },
        onError: (err: any) => toast.error(`Erro ao deletar: ${err.message}`),
    });

    // Mutação para upload (agora opera sobre a lista de 'stagedFiles')
    const uploadMutation = useMutation({
        // ALTERAÇÃO 1: A função agora espera um objeto com o arquivo E o tipo
        mutationFn: ({ stagedFile, type }: { stagedFile: StagedFile, type: string }) => {
            // ALTERAÇÃO 2: Usa o 'type' recebido como argumento, não o do estado
            return uploadDocument(student.id, stagedFile.file, type, (progressEvent) => {
                const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
                setStagedFiles(prev =>
                    prev.map(f => f.id === stagedFile.id ? { ...f, progress: percentCompleted } : f)
                );
            });
        },
        onSuccess: (_, variables) => { // 'variables' agora é { stagedFile, type }
            queryClient.invalidateQueries({ queryKey: ["documents", student.id] });
            // ALTERAÇÃO 3: Acessar o arquivo dentro de 'variables'
            toast.success(`"${variables.stagedFile.file.name}" enviado com sucesso!`);
            setTimeout(() => {
                // ALTERAÇÃO 4: Acessar o id dentro de 'variables'
                setStagedFiles(prev => prev.filter(f => f.id !== variables.stagedFile.id));
            }, 1500);
        },
        onError: (err: any, variables) => { // 'variables' agora é { stagedFile, type }
            setStagedFiles(prev =>
                // ALTERAÇÃO 5: Acessar o id dentro de 'variables'
                prev.map(f => f.id === variables.stagedFile.id ? { ...f, error: err.message, progress: -1 } : f)
            );
            // ALTERAÇÃO 6: Acessar o arquivo dentro de 'variables'
            toast.error(`Falha ao enviar "${variables.stagedFile.file.name}"`);
        },
    });

    // 2. onDrop agora só adiciona arquivos à lista, sem iniciar o upload.
    const onDrop = useCallback((acceptedFiles: File[]) => {
        const newFiles: StagedFile[] = acceptedFiles.map(file => ({
            id: `${file.name}-${Date.now()}`, // Usar Date.now() para garantir ID único
            file,
            progress: 0, // Inicia com progresso 0 (aguardando)
        }));

        setStagedFiles(prev => [...prev, ...newFiles]);
    }, []);

    // 3. Nova função para ser chamada pelo botão e iniciar TODOS os uploads.
    const handleUploadAll = () => {
        if (!documentType.trim()) {
            toast.error("Por favor, defina um tipo de documento antes de enviar.");
            return;
        }
        stagedFiles.forEach(file => {
            if (file.progress === 0 && !file.error) {
                // ALTERAÇÃO 7: Passa o objeto com o arquivo e o tipo do documento atual
                uploadMutation.mutate({ stagedFile: file, type: documentType });
            }
        });
        setDocumentType("");
    };
    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        maxSize: 10485760, // 10MB
        onDropRejected: (fileRejections) => {
            fileRejections.forEach(({ file, errors }) => {
                errors.forEach(error => {
                    if (error.code === 'file-too-large') {
                        toast.error(`Arquivo "${file.name}" é grande demais. Limite de 10MB.`);
                    } else {
                        toast.error(`Erro com o arquivo "${file.name}": ${error.message}`);
                    }
                });
            });
        },
    });

    const removeStagedFile = (id: string) => {
        setStagedFiles(prev => prev.filter(f => f.id !== id));
    }

    return (
        <div className="space-y-8 mt-8">
            {/* Seção de Upload */}
            <div className="space-y-4">
                <h3 className="font-semibold text-lg">Adicionar novo documento</h3>
                <Input
                    id="documentType"
                    label="Tipo do Documento"
                    type="text"
                    placeholder="Ex: RG, CPF, Atestado"
                    value={documentType}
                    onChange={(e) => setDocumentType(e.target.value)}
                />
                <div
                    {...getRootProps()}
                    className={`p-10 border-2 border-dashed rounded-lg text-center cursor-pointer transition-colors
            ${isDragActive ? "border-ifpr-green bg-green-50" : "border-gray-300 bg-gray-50 hover:border-gray-400"}`}
                >
                    <input {...getInputProps()} />
                    <div className="flex flex-col items-center justify-center text-gray-500">
                        <UploadCloud className="w-12 h-12 mb-2" />
                        <p className="font-semibold">Arraste e solte os arquivos aqui ou clique para selecionar</p>
                        <p className="text-sm">Tamanho máximo: 10MB.</p>
                    </div>
                </div>
            </div>

            {/* 4. A lista agora mostra os arquivos preparados, com seu status (aguardando, enviando, erro) */}
            {stagedFiles.length > 0 && (
                <div className="space-y-3">
                    <h4 className="font-semibold">Arquivos para Envio</h4>
                    {stagedFiles.map(stagedFile => (
                        <div key={stagedFile.id} className="border rounded-lg p-3 flex items-center gap-4 bg-white">
                            {getFileIcon(stagedFile.file.name)}
                            <div className="flex-grow">
                                <div className="flex justify-between items-center">
                                    <p className="text-sm font-medium truncate" title={stagedFile.file.name}>{stagedFile.file.name}</p>
                                    {stagedFile.progress > 0 && stagedFile.progress < 100 && <p className="text-sm font-mono">{stagedFile.progress}%</p>}
                                </div>
                                {/* Mostra barra de progresso apenas se o upload tiver começado */}
                                {stagedFile.progress > 0 || stagedFile.progress === -1 ? (
                                    <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
                                        <div
                                            className={`h-2 rounded-full transition-all duration-300 ${stagedFile.error ? "bg-red-500" : stagedFile.progress === 100 ? "bg-green-500" : "bg-ifpr-green"}`}
                                            style={{ width: `${stagedFile.progress > 0 ? stagedFile.progress : 100}%` }}
                                        />
                                    </div>
                                ) : <p className="text-xs text-gray-500 mt-1">Aguardando envio...</p>}
                                {stagedFile.error && <p className="text-xs text-red-600 mt-1">Falha no envio</p>}
                            </div>
                            <button onClick={() => removeStagedFile(stagedFile.id)} className="p-1 rounded-full hover:bg-gray-100">
                                <X className="h-5 w-5 text-gray-500" />
                            </button>
                        </div>
                    ))}
                    {/* 5. O novo botão para iniciar o upload */}
                    <div className="flex justify-end pt-2">
                        <Button onClick={handleUploadAll} loading={uploadMutation.isPending}>
                            <Upload className="h-4 w-4 mr-2" />
                            Enviar {stagedFiles.filter(f => f.progress === 0).length} Documento(s)
                        </Button>
                    </div>
                </div>
            )}

            {/* Lista de Documentos Existentes */}
            <div className="space-y-4">
                <h3 className="font-semibold text-lg border-t pt-6">Documentos Anexados</h3>
                {isLoading && <div className="flex justify-center p-4"><LoaderCircle className="animate-spin" /></div>}
                {isError && <div className="text-red-500"><AlertTriangle className="inline-block mr-2" />Erro ao carregar documentos.</div>}
                {documents && documents.length > 0 ? (
                    <div className="grid md:grid-cols-2 gap-4">
                        {documents.map((doc) => (
                            <div key={doc.id} className="border rounded-lg p-4 shadow-sm bg-white flex flex-col justify-between">
                                <div className="flex items-center gap-3">
                                    {getFileIcon(doc.fileName)}
                                    <div>
                                        <p className="font-medium truncate" title={doc.fileName}>{doc.fileName}</p>
                                        <p className="text-sm text-gray-600">
                                            {doc.documentType} - {new Date(doc.attachmentDate).toLocaleDateString()}
                                        </p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2 mt-3 ml-11">
                                    <Button onClick={() => viewDocument(student.id, doc.id)} variant="outline" title="Visualizar"><Eye className="h-4 w-4" /></Button>
                                    <Button onClick={() => downloadDocument(student.id, doc.id, doc.fileName)} variant="outline" title="Baixar"><Download className="h-4 w-4" /></Button>
                                    <Button onClick={() => deleteMutation.mutate(doc.id)} variant="danger" title="Excluir" loading={deleteMutation.isPending && deleteMutation.variables === doc.id}>
                                        <Trash2 className="h-4 w-4" />
                                    </Button>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (!isLoading && <p className="text-gray-500 text-center py-4">Nenhum documento encontrado.</p>)}
            </div>
        </div>
    );
}