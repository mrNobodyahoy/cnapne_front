// src/pages/student/StudentHomePage.tsx

import { useQuery } from '@tanstack/react-query';
import { getStudentMe } from '../../services/studentService';
import { LoaderCircle, AlertTriangle } from 'lucide-react';
import StudentProfileView from './StudentProfileView';
import StudentTimeline from '../../components/student/StudentTimeline';

export default function StudentHomePage() {
    // 1. Busca os dados do estudante logado
    const { data: student, isLoading, isError } = useQuery({
        queryKey: ['student-profile-me'],
        queryFn: getStudentMe,
    });

    // 2. Lida com o estado de carregamento
    if (isLoading) {
        return (
            <div className="flex justify-center items-center h-64">
                <LoaderCircle className="animate-spin text-ifpr-green h-12 w-12" />
            </div>
        );
    }

    // 3. Lida com o estado de erro
    if (isError || !student) {
        return (
            <div className="max-w-4xl mx-auto mt-6 p-8 bg-red-50 text-red-700 rounded-2xl flex flex-col items-center gap-4">
                <AlertTriangle className="h-12 w-12" />
                <h2 className="text-2xl font-bold">Erro ao Carregar Informações</h2>
                <p>Não foi possível buscar seus dados. Por favor, tente recarregar a página.</p>
            </div>
        );
    }

    // 4. Renderiza a página com os componentes de perfil e timeline
    return (
        <div className="max-w-5xl mx-auto p-4 md:p-8 space-y-8">
            {/* Componente que exibe os dados do perfil */}
            <StudentProfileView student={student} />

            {/* Componente que exibe a linha do tempo */}
            <div className="bg-white rounded-xl shadow-md border border-gray-200 p-6 mt-8">
                <h2 className="text-2xl font-bold text-gray-800 border-b pb-4 mb-6">
                    Minha Linha do Tempo
                </h2>
                <StudentTimeline studentId={student.id} />
            </div>
        </div>
    );
}