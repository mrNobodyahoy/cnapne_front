import { Link, useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getAcompanhamentoById, deleteAcompanhamento } from '../../../services/followUpService';
import {
    LoaderCircle, AlertTriangle, ArrowLeft, Edit, Trash, Calendar, Clock, MapPin,
    User, Users, FileText, CheckCircle, Target, Award, GraduationCap, Hash
} from 'lucide-react';
import { format, parseISO } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import Button from '../../../components/ui/Button';
import toast from 'react-hot-toast';

// Componente auxiliar reutilizado
const InfoField = ({ icon: Icon, label, value, className = '' }: { icon: any, label: string, value: string | undefined | null, className?: string }) => (
    <div className={className}>
        <div className="flex items-center text-sm font-medium text-gray-500">
            <Icon className="h-4 w-4 mr-2" />
            <span>{label}</span>
        </div>
        <p className="mt-1 text-base text-gray-800 break-words">{value || 'Não informado'}</p>
    </div>
);

export default function AcompanhamentoProfilePage() {
    const { acompanhamentoId } = useParams<{ acompanhamentoId: string }>();
    const navigate = useNavigate();
    const queryClient = useQueryClient();

    const { data: acompanhamento, isLoading, isError } = useQuery({
        queryKey: ['acompanhamento', acompanhamentoId],
        queryFn: () => getAcompanhamentoById(acompanhamentoId!),
        enabled: !!acompanhamentoId,
    });

    const deleteMutation = useMutation({
        mutationFn: () => deleteAcompanhamento(acompanhamentoId!),
        onSuccess: () => {
            toast.success('Acompanhamento deletado com sucesso!');
            queryClient.invalidateQueries({ queryKey: ['acompanhamentos'] });
            navigate('/acompanhamentos');
        },
        onError: (err: any) => toast.error(`Erro ao deletar: ${err.message}`),
    });

    const handleDelete = () => {
        if (window.confirm('Tem certeza que deseja deletar este acompanhamento?')) {
            deleteMutation.mutate();
        }
    };

    if (isLoading) {
        return <div className="flex justify-center p-8"><LoaderCircle className="animate-spin text-ifpr-green h-8 w-8" /></div>;
    }

    if (isError || !acompanhamento) {
        return <div className="text-red-600 p-8"><AlertTriangle /> Erro ao carregar dados do acompanhamento.</div>;
    }

    return (
        <div className="max-w-5xl mx-auto space-y-6">
            <Link to="/acompanhamentos" className="inline-flex items-center gap-2 text-ifpr-green hover:underline">
                <ArrowLeft className="h-5 w-5" />
                Voltar para a lista de acompanhamentos
            </Link>

            <div className="bg-white p-6 rounded-xl border shadow-sm flex justify-between items-start">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Acompanhamento</h1>
                    <p className="mt-1 text-lg text-gray-600">Detalhes do Registro</p>
                </div>
                <div className="flex gap-2">
                    <Button onClick={() => navigate(`/acompanhamentos/${acompanhamentoId}/edit`)} variant="outline" title="Editar">
                        <Edit className="h-4 w-4" />
                    </Button>
                    <Button onClick={handleDelete} variant="danger" loading={deleteMutation.isPending} title="Deletar">
                        <Trash className="h-4 w-4" />
                    </Button>
                </div>
            </div>

            <div className="space-y-6">
                <Link to={`/alunos/${acompanhamento.student.id}`} className="block bg-white p-6 rounded-xl border hover:border-ifpr-green hover:bg-green-50 transition-all">
                    <div className="flex items-center border-b pb-3 mb-4">
                        <User className="h-6 w-6 text-ifpr-green mr-3" />
                        <h2 className="text-xl font-bold text-gray-800">Aluno Vinculado</h2>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                        <InfoField icon={User} label="Nome Completo" value={acompanhamento.student.completeName} />
                        <InfoField icon={Hash} label="Matrícula" value={acompanhamento.student.registration} />
                        <InfoField icon={GraduationCap} label="Turma" value={acompanhamento.student.team} />
                        <InfoField icon={CheckCircle} label="Status" value={acompanhamento.student.status} />
                    </div>
                </Link>

                <div className="bg-white p-6 rounded-xl border shadow-sm">
                    <h2 className="text-xl font-bold text-gray-800 border-b pb-3 mb-4">Detalhes da Sessão</h2>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                        <InfoField icon={Calendar} label="Data" value={format(parseISO(acompanhamento.sessionDate), "dd/MM/yyyy", { locale: ptBR })} />
                        <InfoField icon={Clock} label="Horário" value={acompanhamento.sessionTime} />
                        <InfoField icon={MapPin} label="Local" value={acompanhamento.sessionLocation} />
                        <InfoField icon={CheckCircle} label="Status da Sessão" value={acompanhamento.status} />
                    </div>
                </div>

                <div className="bg-white p-6 rounded-xl border shadow-sm">
                    <h2 className="text-xl font-bold text-gray-800 border-b pb-3 mb-4">Registros do Acompanhamento</h2>
                    <div className="space-y-6">
                        <InfoField icon={FileText} label="Descrição" value={acompanhamento.description} />
                        <InfoField icon={Target} label="Áreas Abordadas" value={acompanhamento.areasCovered} />
                        <InfoField icon={Award} label="Próximos Passos" value={acompanhamento.nextSteps} />
                        <InfoField icon={FileText} label="Tarefas / Encaminhamentos" value={acompanhamento.tasks} />
                    </div>
                </div>

                <div className="bg-white p-6 rounded-xl border shadow-sm">
                    <h2 className="text-xl font-bold text-gray-800 border-b pb-3 mb-4">Profissionais Envolvidos</h2>
                    <ul className="space-y-3">
                        {acompanhamento.professionals.map(prof => (
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
        </div>
    );
}