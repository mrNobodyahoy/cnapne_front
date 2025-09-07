import Input from "../ui/Input";
import { UploadCloud } from "lucide-react";

type Props = {
    documentType: string;
    setDocumentType: (value: string) => void;
    dropzone: {
        getRootProps: any;
        getInputProps: any;
        isDragActive: boolean;
    };
};

export default function DocumentUploader({ documentType, setDocumentType, dropzone }: Props) {
    const { getRootProps, getInputProps, isDragActive } = dropzone;
    return (
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
                className={`p-10 border-2 border-dashed rounded-lg text-center cursor-pointer transition-colors ${isDragActive ? "border-ifpr-green bg-green-50" : "border-gray-300 bg-gray-50 hover:border-gray-400"}`}
            >
                <input {...getInputProps()} />
                <div className="flex flex-col items-center justify-center text-gray-500">
                    <UploadCloud className="w-12 h-12 mb-2" />
                    <p className="font-semibold">Arraste e solte ou clique para selecionar</p>
                    <p className="text-sm">Tamanho máximo: 10MB.</p>
                </div>
            </div>
        </div>
    );
}