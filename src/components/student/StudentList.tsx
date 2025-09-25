import { Link } from 'react-router-dom';
import type { StudentSummary } from '../../types/student';
import { ClipboardList } from 'lucide-react';

interface StudentListProps {
  students: StudentSummary[] | undefined;
}

export default function StudentList({ students }: StudentListProps) {
  if (!students || students.length === 0) {
    return (
      <div className="rounded-lg border bg-white shadow-sm p-6 text-center text-gray-500 mt-6">
        Nenhum estudante encontrado para os filtros selecionados.
      </div>
    );
  }

  // ALTERAÇÃO 1: Simplificar para renderizar uma única lista
  return (
    <div className="mt-6">
      <ul className="divide-y divide-gray-200 rounded-lg border bg-white shadow-sm">
        {students.map((student) => (
          <li key={student.id} className="flex justify-between items-center p-4 hover:bg-gray-50 transition-colors">
            <Link to={`/alunos/${student.id}`} className="flex-grow">
              <div>
                <p className="font-semibold text-gray-900">{student.completeName}</p>
                <div className="text-sm text-gray-600">
                  Matrícula: <span className="font-medium">{student.registration}</span>
                  {' • '}
                  Turma: <span className="font-medium">{student.team}</span>
                </div>
              </div>
            </Link>

            <div className="flex items-center gap-4 ml-4">
              <span
                className={`text-xs font-semibold px-3 py-1 rounded-full ${student.status === 'ATIVO'
                    ? 'bg-green-100 text-green-700'
                    : 'bg-red-100 text-red-700'
                  }`}
              >
                {student.status}
              </span>
              <Link
                to={`/alunos/${student.id}/sessoes`}
                className="flex items-center gap-2 px-3 py-2 text-sm text-ifpr-green border border-gray-300 rounded-lg hover:bg-green-50 transition-colors"
                title="Gerenciar Atendimentos e Acompanhamentos"
              >
                <ClipboardList className="h-4 w-4" />
                <span>Sessões</span>
              </Link>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}