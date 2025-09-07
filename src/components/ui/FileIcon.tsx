import { FileText, FileImage, FileType, FileSpreadsheet, FileArchive, FileBadge } from "lucide-react";

const getIcon = (fileName: string) => {
    const extension = fileName.split('.').pop()?.toLowerCase();
    switch (extension) {
        case 'pdf': return <FileType className="h-8 w-8 text-red-500 flex-shrink-0" />;
        case 'png': case 'jpg': case 'jpeg': case 'gif': return <FileImage className="h-8 w-8 text-blue-500 flex-shrink-0" />;
        case 'doc': case 'docx': return <FileBadge className="h-8 w-8 text-indigo-500 flex-shrink-0" />;
        case 'xls': case 'xlsx': return <FileSpreadsheet className="h-8 w-8 text-green-500 flex-shrink-0" />;
        case 'zip': case 'rar': case '7z': return <FileArchive className="h-8 w-8 text-purple-500 flex-shrink-0" />;
        default: return <FileText className="h-8 w-8 text-gray-500 flex-shrink-0" />;
    }
};

export default function FileIcon({ fileName }: { fileName: string }) {
    return getIcon(fileName);
}