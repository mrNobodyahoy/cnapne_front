// src/components/student/StudentList.tsx
import { Link } from 'react-router-dom';
import type { StudentSummary } from '../../types/student';

interface StudentListProps {
  students: StudentSummary[] | undefined;
}

export default function StudentList({ students }: StudentListProps) {
  if (!students || students.length === 0) {
    return (
      <div className="rounded-lg border bg-white shadow-sm p-6 text-center text-gray-500 mt-6">
        Nenhum estudante encontrado.
      </div>
    );
  }

  const ativos = students.filter((s) => s.status === 'ATIVO');
  const inativos = students.filter((s) => s.status === 'INATIVO');

  const renderList = (lista: StudentSummary[]) => (
    <ul className="divide-y divide-gray-200 rounded-lg border bg-white shadow-sm">
      {lista.map((student) => (
        <li key={student.id}>
          <Link
            to={`/alunos/${student.id}`}
            className="flex justify-between items-center p-4 hover:bg-gray-50 transition-colors"
          >
            <div>
              <p className="font-semibold text-gray-900">{student.completeName}</p>
              <div className="text-sm text-gray-600">
                Matrícula: <span className="font-medium">{student.registration}</span>
                {' • '}
                Turma: <span className="font-medium">{student.team}</span>
              </div>
            </div>
            <span
              className={`text-xs font-semibold px-3 py-1 rounded-full ${
                student.status === 'ATIVO'
                  ? 'bg-green-100 text-green-700'
                  : 'bg-red-100 text-red-700'
              }`}
            >
              {student.status}
            </span>
          </Link>
        </li>
      ))}
    </ul>
  );

  return (
    <div className="space-y-8 mt-6">
      {ativos.length > 0 && (
        <div>
          <h2 className="text-lg font-bold text-gray-800 mb-3">Estudantes Ativos</h2>
          {renderList(ativos)}
        </div>
      )}
      {inativos.length > 0 && (
        <div>
          <h2 className="text-lg font-bold text-gray-800 mb-3">Estudantes Inativos</h2>
          {renderList(inativos)}
        </div>
      )}
    </div>
  );
}
