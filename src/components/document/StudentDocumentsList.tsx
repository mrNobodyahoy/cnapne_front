import type { Student } from "../../types/student";
import { useStudentDocuments } from "../../hooks/useStudentDocuments";

import DocumentUploader from "./DocumentUploader";
import StagedFilesList from "./StagedFilesList";
import ExistingDocumentsList from "./ExistingDocumentsList";

export default function StudentDocumentsList({ student }: { student: Student }) {
    const {
        documents,
        isLoading,
        isError,
        deleteMutation,
        stagedFiles,
        documentType,
        setDocumentType,
        handleUploadAll,
        removeStagedFile,
        uploadMutationIsPending,
        dropzone,
    } = useStudentDocuments(student.id);

    return (
        <div className="space-y-8 mt-8">
            <DocumentUploader
                documentType={documentType}
                setDocumentType={setDocumentType}
                dropzone={dropzone}
            />

            <StagedFilesList
                files={stagedFiles}
                onRemove={removeStagedFile}
                onUploadAll={handleUploadAll}
                isUploading={uploadMutationIsPending}
            />

            <ExistingDocumentsList
                documents={documents}
                isLoading={isLoading}
                isError={isError}
                studentId={student.id}
                deleteMutation={deleteMutation}
            />
        </div>
    );
}