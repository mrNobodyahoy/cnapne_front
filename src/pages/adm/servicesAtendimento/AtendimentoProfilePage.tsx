import { Link, useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getAtendimentoById, deleteAtendimento } from '../../../services/atendimentoService';
import {
    LoaderCircle, AlertTriangle, ArrowLeft, Edit, Trash, Calendar, Clock, MapPin,
    User, Users, FileText, CheckCircle, Target, Award, GraduationCap, Hash, ClipboardPenLine,
    FileDown
} from 'lucide-react';
import { format, parseISO } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import Button from '../../../components/ui/Button';
import toast from 'react-hot-toast';
import { useState } from 'react';
import Modal from '../../../components/ui/Modal';
import TeacherGuidanceForm from '../../../components/session/teacherGuidance/TeacherGuidanceForm';
import TeacherGuidanceDetails from '../../../components/session/teacherGuidance/TeacherGuidanceDetails';
import { generateGuidancePdf } from '../../../lib/pdfGenerator';

interface InfoFieldProps {
    icon: any;
    label: string;
    value: string | undefined | null;
    className?: string;
}
const InfoField = ({ icon: Icon, label, value, className = '' }: InfoFieldProps) => (
    <div className={className}>
        <div className="flex items-center text-sm font-medium text-gray-500">
            <Icon className="h-4 w-4 mr-2" />
            <span>{label}</span>
        </div>
        <p className="mt-1 text-base text-gray-800 break-words">{value || 'Não informado'}</p>
    </div>
);


export default function AtendimentoProfilePage() {
    const { atendimentoId } = useParams<{ atendimentoId: string }>();
    const navigate = useNavigate();
    const queryClient = useQueryClient();

    const [isGuidanceModalOpen, setIsGuidanceModalOpen] = useState(false);
    const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);

    const { data: atendimento, isLoading, isError } = useQuery({
        queryKey: ['atendimento', atendimentoId],
        queryFn: () => getAtendimentoById(atendimentoId!),
        enabled: !!atendimentoId,
    });

    const deleteMutation = useMutation({
        mutationFn: () => deleteAtendimento(atendimentoId!),
        onSuccess: () => {
            toast.success('Atendimento deletado com sucesso!');
            queryClient.invalidateQueries({ queryKey: ['atendimentos'] });
            navigate('/atendimentos');
        },
        onError: (err: any) => toast.error(`Erro ao deletar: ${err.message}`),
    });

    const handleDelete = () => {
        if (window.confirm('Tem certeza que deseja deletar este atendimento? Esta ação não pode ser desfeita.')) {
            deleteMutation.mutate();
        }
    };

    const handlePdfDownload = (e: React.MouseEvent) => {
        e.stopPropagation();
        if (atendimento?.teacherGuidance) {
            generateGuidancePdf(atendimento.teacherGuidance);
        }
    };
    const handleOpenEditModal = (e: React.MouseEvent) => {
        e.stopPropagation();
        setIsEditModalOpen(true);
    };

    if (isLoading) {
        return <div className="flex justify-center p-8"><LoaderCircle className="animate-spin text-ifpr-green h-8 w-8" /></div>;
    }

    if (isError || !atendimento) {
        return <div className="text-red-600 p-8"><AlertTriangle /> Erro ao carregar dados do atendimento.</div>;
    }

    return (
        <div className="max-w-5xl mx-auto space-y-6">
            <Link to="/atendimentos" className="inline-flex items-center gap-2 text-ifpr-green hover:underline">
                <ArrowLeft className="h-5 w-5" />
                Voltar para a lista de atendimentos
            </Link>

            <div className="bg-white p-6 rounded-xl border shadow-sm flex justify-between items-start">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">{atendimento.typeService}</h1>
                    <p className="mt-1 text-lg text-gray-600">Detalhes do Atendimento</p>
                </div>
                <div className="flex gap-2">
                    {!atendimento.teacherGuidance ? (
                        <Button
                            onClick={() => setIsGuidanceModalOpen(true)}
                            variant="info"
                            title="Criar Orientação Pedagógica"
                            className="flex items-center gap-2"
                        >
                            <ClipboardPenLine className="h-4 w-4" />
                            <span>Criar Orientação</span>
                        </Button>
                    ) : null}
                    <Button onClick={() => navigate(`/atendimentos/${atendimentoId}/edit`)} variant="outline" title="Editar">
                        <Edit className="h-4 w-4" />
                    </Button>
                    <Button onClick={handleDelete} variant="danger" loading={deleteMutation.isPending} title="Deletar">
                        <Trash className="h-4 w-4" />
                    </Button>
                </div>
            </div>

            <div className="space-y-6">

                <Link
                    to={`/alunos/${atendimento.student.id}`}
                    className="block bg-white p-6 rounded-xl border border-gray-200 shadow-sm hover:border-ifpr-green hover:bg-green-50 transition-all duration-200"
                    title="Clique para ver o perfil completo do aluno"
                >
                    <div className="flex items-center border-b pb-3 mb-4">
                        <User className="h-6 w-6 text-ifpr-green mr-3" />
                        <h2 className="text-xl font-bold text-gray-800">Aluno Vinculado</h2>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                        <InfoField icon={User} label="Nome Completo" value={atendimento.student.completeName} />
                        <InfoField icon={Hash} label="Matrícula" value={atendimento.student.registration} />
                        <InfoField icon={GraduationCap} label="Turma" value={atendimento.student.team} />
                        <InfoField icon={CheckCircle} label="Status" value={atendimento.student.status} />
                    </div>
                </Link>

                <div className="bg-white p-6 rounded-xl border shadow-sm">
                    <h2 className="text-xl font-bold text-gray-800 border-b pb-3 mb-4">Detalhes da Sessão</h2>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                        <InfoField icon={Calendar} label="Data" value={format(parseISO(atendimento.sessionDate), "dd/MM/yyyy", { locale: ptBR })} />
                        <InfoField icon={Clock} label="Horário" value={atendimento.sessionTime} />
                        <InfoField icon={MapPin} label="Local" value={atendimento.sessionLocation} />
                        <InfoField icon={CheckCircle} label="Status da Sessão" value={atendimento.status} />
                    </div>
                </div>

                <div className="bg-white p-6 rounded-xl border shadow-sm">
                    <h2 className="text-xl font-bold text-gray-800 border-b pb-3 mb-4">Registros do Atendimento</h2>
                    <div className="space-y-6">
                        <InfoField icon={FileText} label="Descrição" value={atendimento.descriptionService} />
                        <InfoField icon={Target} label="Objetivos" value={atendimento.objectives} />
                        <InfoField icon={Award} label="Resultados" value={atendimento.results} />
                        <InfoField icon={FileText} label="Tarefas / Encaminhamentos" value={atendimento.tasks} />
                    </div>
                </div>

                {atendimento.teacherGuidance && (
                    <div
                        onClick={() => setIsDetailsModalOpen(true)}
                        className="relative block bg-white p-6 rounded-xl border border-gray-200 shadow-sm hover:border-ifpr-green transition-all duration-200 cursor-pointer group"
                        title="Clique para ver os detalhes da Orientação"
                    >
                        <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                            <Button
                                onClick={handleOpenEditModal}
                                variant="outline"
                                className="p-2 h-auto"
                                title="Editar Orientação"
                            >
                                <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                                onClick={handlePdfDownload}
                                variant="outline"
                                className="p-2 h-auto"
                                title="Gerar PDF"
                            >
                                <FileDown className="h-4 w-4" />
                            </Button>
                        </div>

                        <div className="flex items-center border-b pb-3 mb-4">
                            <ClipboardPenLine className="h-6 w-6 text-ifpr-green mr-3" />
                            <h2 className="text-xl font-bold text-gray-800">Orientação Pedagógica Vinculada</h2>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <InfoField
                                icon={User}
                                label="Autor(a)"
                                value={atendimento.teacherGuidance.author?.fullName || 'Não informado'}
                            />
                            <InfoField
                                icon={MapPin}
                                label="Local"
                                value={atendimento.teacherGuidance.domiciliar ? 'Domiciliar' : 'Sala de Aula'}
                            />
                            <InfoField
                                icon={Calendar}
                                label="Data"
                                value={format(parseISO(atendimento.teacherGuidance.createdAt), "dd/MM/yyyy", { locale: ptBR })}
                            />
                        </div>
                    </div>
                )}

                <div className="bg-white p-6 rounded-xl border shadow-sm">
                    <h2 className="text-xl font-bold text-gray-800 border-b pb-3 mb-4">Profissionais Envolvidos</h2>
                    <ul className="space-y-3">
                        {atendimento.professionals.map(prof => (
                            <li key={prof.id} className="flex items-center gap-3">
                                <Users className="h-5 w-5 text-ifpr-green" />
                                <div>
                                    <p className="font-semibold">{prof.fullName}</p>
                                    <p className="text-sm text-gray-500">{prof.specialty}</p>
                                </div>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>

            {atendimento.teacherGuidance && (
                <Modal isOpen={isEditModalOpen} onClose={() => setIsEditModalOpen(false)}>
                    <TeacherGuidanceForm
                        existingGuidance={atendimento.teacherGuidance}
                        serviceId={atendimentoId}
                        onClose={() => setIsEditModalOpen(false)}
                    />
                </Modal>
            )}

            <Modal isOpen={isGuidanceModalOpen} onClose={() => setIsGuidanceModalOpen(false)}>
                <TeacherGuidanceForm
                    serviceId={atendimentoId}
                    onClose={() => setIsGuidanceModalOpen(false)}
                />
            </Modal>

            {atendimento.teacherGuidance && (
                <Modal isOpen={isDetailsModalOpen} onClose={() => setIsDetailsModalOpen(false)}>
                    <TeacherGuidanceDetails guidance={atendimento.teacherGuidance} />
                </Modal>
            )}

        </div>
    );
}