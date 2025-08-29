// src/components/student/StudentCards.tsx

import { Link } from 'react-router-dom';
// 1. Importamos a interface StudentSummary em vez de Student
import type { StudentSummary } from '../../types/student';
import { CheckCircle, XCircle } from 'lucide-react';

// 2. A interface de props agora espera o tipo correto
interface StudentCardsProps {
  students: StudentSummary[] | undefined;
}

export default function StudentCards({ students }: StudentCardsProps) {
  if (!students || students.length === 0) {
    return (
      <div className="rounded-lg border bg-white shadow-sm p-8 text-center text-gray-500 mt-6">
        Nenhum estudante encontrado.
      </div>
    );
  }

  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 mt-6">
      {students.map((student) => (
        <Link to={`/alunos/${student.id}`} key={student.id} className="group">
          <div
            className="rounded-xl border border-gray-200 bg-white shadow-lg group-hover:shadow-xl group-hover:border-ifpr-green transition-all duration-300 ease-in-out flex flex-col overflow-hidden h-full"
          >
            <div className="p-6 flex-1 space-y-3">
              <h3 className="text-xl font-bold text-gray-900 leading-tight">
                {student.completeName}
              </h3>
              <div className="text-sm font-medium text-gray-700">
                <span className="text-gray-500">Matrícula: </span>
                <span className="text-gray-900 font-semibold">{student.registration}</span>
              </div>
              
              {/* 3. Trocamos o 'email' pela 'turma' (team) */}
              <div className="text-sm font-medium text-gray-700">
                <span className="text-gray-500">Turma: </span>
                <span className="text-gray-900 font-semibold">{student.team}</span>
              </div>

              <div className="pt-2">
                <span
                  className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold ${
                    student.status === 'ATIVO'
                      ? 'bg-green-50 text-green-700 ring-1 ring-inset ring-green-600/20'
                      : 'bg-red-50 text-red-700 ring-1 ring-inset ring-red-600/20'
                  }`}
                >
                  {student.status === 'ATIVO' ? <CheckCircle className="h-4 w-4" /> : <XCircle className="h-4 w-4" />}
                  {student.status}
                </span>
              </div>
            </div>
            
          </div>
        </Link>
      ))}
    </div>
  );
}