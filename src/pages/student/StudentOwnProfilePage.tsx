// src/pages/StudentOwnProfilePage.tsx

import { useQuery } from "@tanstack/react-query";
import { getStudentMe } from "../../services/studentService";
import { formatPhone } from "../../lib/formatters";
import {
  UserCircle,
  Mail,
  Phone,
  Calendar,
  Users,
  Hash,
  CheckCircle,
  BookUser,
  HeartHandshake,
  AlertTriangle,
  CaseSensitive,
  PersonStanding
} from "lucide-react";


const InfoField = ({ icon: Icon, label, value }: { icon: React.ElementType, label: string, value: string | undefined }) => (
  <div>
    <div className="flex items-center text-sm text-gray-500">
      <Icon className="h-4 w-4 mr-2" />
      <span>{label}</span>
    </div>
    <p className="font-semibold text-gray-800 text-base mt-1">{value || 'Não informado'}</p>
  </div>
);

const SectionCard = ({ title, icon: Icon, children }: { title: string, icon: React.ElementType, children: React.ReactNode }) => (
  <div className="bg-white rounded-xl shadow-md border border-gray-200 p-6">
    <div className="flex items-center border-b pb-3 mb-4">
      <Icon className="h-6 w-6 text-ifpr-green mr-3" />
      <h2 className="text-xl font-bold text-gray-800">{title}</h2>
    </div>
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
      {children}
    </div>
  </div>
);

const ProfileSkeleton = () => (
  <div className="max-w-4xl mx-auto mt-6 animate-pulse">
    <div className="bg-white rounded-2xl shadow p-8 space-y-6">
      <div className="flex items-center gap-4 border-b pb-4">
        <div className="w-20 h-20 rounded-full bg-gray-200"></div>
        <div className="space-y-2">
          <div className="h-8 w-64 bg-gray-300 rounded"></div>
          <div className="h-4 w-48 bg-gray-200 rounded"></div>
        </div>
      </div>
      <div className="h-40 bg-gray-200 rounded-xl"></div>
      <div className="h-32 bg-gray-200 rounded-xl"></div>
    </div>
  </div>
);


export default function StudentOwnProfilePage() {
  const { data: student, isLoading, error } = useQuery({
    queryKey: ["student-profile-me"],
    queryFn: getStudentMe,
  });

  if (isLoading) return <ProfileSkeleton />;

  if (error) return (
    <div className="max-w-4xl mx-auto mt-6 p-8 bg-red-50 text-red-700 border border-red-200 rounded-2xl flex flex-col items-center gap-4">
      <AlertTriangle className="h-12 w-12" />
      <h2 className="text-2xl font-bold">Erro ao Carregar Perfil</h2>
      <p>Não foi possível buscar suas informações. Por favor, tente recarregar a página.</p>
    </div>
  );

  if (!student) return <p>Não foi possível carregar os dados.</p>;

  return (
    <div className="max-w-4xl mx-auto mt-6 space-y-8">
      <div className="bg-white rounded-2xl shadow p-8 flex items-center gap-6">
        <UserCircle className="h-24 w-24 text-gray-300" strokeWidth={1} />
        <div>
          <h1 className="text-4xl font-bold text-gray-900">{student.completeName}</h1>
          <p className="text-gray-600 text-lg mt-1">Estudante</p>
        </div>
      </div>

      <div className="space-y-6">
        <SectionCard title="Dados Acadêmicos" icon={BookUser}>
          <InfoField icon={Hash} label="Matrícula" value={student.registration} />
          <InfoField icon={Users} label="Turma" value={student.team} />
          <InfoField icon={CheckCircle} label="Status" value={student.status} />
        </SectionCard>

        <SectionCard title="Informações Pessoais" icon={PersonStanding}>
          <InfoField icon={Mail} label="Email" value={student.email} />
          <InfoField icon={Phone} label="Telefone" value={formatPhone(student.phone)} />
          <InfoField icon={Calendar} label="Data de Nascimento" value={new Date(student.birthDate).toLocaleDateString('pt-BR')} />
          <InfoField icon={CaseSensitive} label="Gênero" value={student.gender} />
          <InfoField icon={Users} label="Etnia" value={student.ethnicity} />
        </SectionCard>

        {student.responsibles && student.responsibles.length > 0 && (
          <div className="bg-white rounded-xl shadow-md border border-gray-200 p-6">
            <div className="flex items-center border-b pb-3 mb-4">
              <HeartHandshake className="h-6 w-6 text-ifpr-green mr-3" />
              <h2 className="text-xl font-bold text-gray-800">Responsáveis</h2>
            </div>
            <div className="space-y-4">
              {student.responsibles.map((resp, idx) => (
                <div key={idx} className="p-4 border rounded-lg bg-gray-50 grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <InfoField icon={UserCircle} label="Nome" value={resp.completeName} />
                  <InfoField icon={HeartHandshake} label="Parentesco" value={resp.kinship} />
                  <InfoField icon={Mail} label="Email" value={resp.email} />
                  <InfoField icon={Phone} label="Telefone" value={formatPhone(resp.phone)} />
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}