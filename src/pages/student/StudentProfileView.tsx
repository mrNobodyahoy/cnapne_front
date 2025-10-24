// src/pages/student/StudentProfileView.tsx

import { formatPhone, formatGender } from '../../lib/formatters';
import type { Student } from '../../types/student';
import {
  UserCircle, Mail, Phone, Calendar, Users, Hash, CheckCircle,
  BookUser, HeartHandshake, CaseSensitive, PersonStanding
} from "lucide-react";

const InfoField = ({ icon: Icon, label, value }: { icon: React.ElementType, label: string, value?: string }) => (
  <div>
    <div className="flex items-center text-sm text-gray-500"><Icon className="h-4 w-4 mr-2" /><span>{label}</span></div>
    <p className="font-semibold text-gray-800 text-base mt-1">{value || 'Não informado'}</p>
  </div>
);

const SectionCard = ({ title, icon: Icon, children }: { title: string, icon: React.ElementType, children: React.ReactNode }) => (
  <div className="bg-white rounded-xl shadow-md border border-gray-200 p-6">
    <div className="flex items-center border-b pb-3 mb-4"><Icon className="h-6 w-6 text-ifpr-green mr-3" /><h2 className="text-xl font-bold text-gray-800">{title}</h2></div>
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">{children}</div>
  </div>
);


export default function StudentProfileView({ student }: { student: Student }) {
  return (
    <div className="space-y-6">
      <div className="bg-white rounded-2xl shadow p-8 flex items-center gap-6">
        <UserCircle className="h-24 w-24 text-gray-300" strokeWidth={1} />
        <div>
          <h1 className="text-4xl font-bold text-gray-900">{student.completeName}</h1>
          <p className="text-gray-600 text-lg mt-1">Estudante</p>
        </div>
      </div>

      <SectionCard title="Dados Acadêmicos" icon={BookUser}>
        <InfoField icon={Hash} label="Matrícula" value={student.registration} />
        <InfoField icon={Users} label="Turma" value={student.team} />
        <InfoField icon={CheckCircle} label="Status" value={student.status} />
      </SectionCard>

      <SectionCard title="Informações Pessoais" icon={PersonStanding}>
        <InfoField icon={Mail} label="Email" value={student.email} />
        <InfoField icon={Phone} label="Telefone" value={formatPhone(student.phone)} />
        <InfoField icon={Calendar} label="Data de Nascimento" value={new Date(student.birthDate).toLocaleDateString('pt-BR')} />
        <InfoField icon={CaseSensitive} label="Gênero" value={formatGender(student.gender)} />
        <InfoField icon={Users} label="Etnia" value={student.ethnicity} />
      </SectionCard>

      {student.responsibles && student.responsibles.length > 0 && (
        <div className="bg-white rounded-xl shadow-md border border-gray-200 p-6">
          <div className="flex items-center border-b pb-3 mb-4"><HeartHandshake className="h-6 w-6 text-ifpr-green mr-3" /><h2 className="text-xl font-bold text-gray-800">Responsáveis</h2></div>
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
  );
}