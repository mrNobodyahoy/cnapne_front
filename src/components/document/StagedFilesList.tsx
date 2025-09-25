import type { StagedFile } from "../../types/document";
import FileIcon from "../ui/FileIcon";
import Button from "../ui/Button";
import { X, Upload } from "lucide-react";

type Props = {
    files: StagedFile[];
    onRemove: (id: string) => void;
    onUploadAll: () => void;
    isUploading: boolean;
};

export default function StagedFilesList({ files, onRemove, onUploadAll, isUploading }: Props) {
    if (files.length === 0) return null;

    const filesAwaiting = files.filter(f => f.progress === 0 && !f.error).length;

    return (
        <div className="space-y-3">
            <h4 className="font-semibold">Arquivos para Envio</h4>
            {files.map(stagedFile => (
                <div key={stagedFile.id} className="border rounded-lg p-3 flex items-center gap-4 bg-white">
                    <FileIcon fileName={stagedFile.file.name} />

                    <div className="flex-grow overflow-hidden">
                        <div className="flex justify-between items-center">
                            <p className="text-sm font-medium text-gray-800 truncate" title={stagedFile.file.name}>
                                {stagedFile.file.name}
                            </p>
                            {stagedFile.progress > 0 && stagedFile.progress < 100 && (
                                <p className="text-sm font-mono text-gray-600 flex-shrink-0 ml-2">{stagedFile.progress}%</p>
                            )}
                        </div>

                        {stagedFile.progress === 0 && !stagedFile.error && (
                            <p className="text-xs text-gray-500 mt-1">Aguardando envio...</p>
                        )}
                        {(stagedFile.progress > 0 || stagedFile.progress === -1) && (
                            <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
                                <div
                                    className={`h-2 rounded-full transition-all duration-300 ${stagedFile.error ? "bg-red-500"
                                        : stagedFile.progress === 100 ? "bg-green-500"
                                            : "bg-ifpr-green"
                                        }`}
                                    style={{ width: `${stagedFile.progress > 0 ? stagedFile.progress : 100}%` }}
                                />
                            </div>
                        )}

                        {stagedFile.error && (
                            <p className="text-xs text-red-600 mt-1">Falha no envio</p>
                        )}
                    </div>

                    <button onClick={() => onRemove(stagedFile.id)} className="p-1 rounded-full hover:bg-gray-100 flex-shrink-0">
                        <X className="h-5 w-5 text-gray-500" />
                    </button>
                </div>
            ))}
            <div className="flex justify-end pt-2">
                <Button onClick={onUploadAll} loading={isUploading} disabled={filesAwaiting === 0}>
                    <Upload className="h-4 w-4 mr-2" />
                    Enviar {filesAwaiting > 0 ? `${filesAwaiting} Documento(s)` : 'Enviado'}
                </Button>
            </div>
        </div>
    );
}