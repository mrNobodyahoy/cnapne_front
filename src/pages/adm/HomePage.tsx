import { useHomePageData } from '../../hooks/useHomePageData';
import StatCard from '../../components/dashboard/StatCard';
import SessionList from '../../components/dashboard/SessionList';
import Button from '../../components/ui/Button';
import { ClipboardList, ClipboardCheck, AlertTriangle, LoaderCircle } from 'lucide-react';

export default function HomePage() {
  const {
    atendimentos,
    totalAtendimentos,
    atendimentosPageData,
    setAtendimentosPage,
    acompanhamentos,
    totalAcompanhamentos,
    acompanhamentosPageData,
    setAcompanhamentosPage,
    isLoading,
    isFetching,
    isError
  } = useHomePageData();

  if (isLoading && !atendimentosPageData && !acompanhamentosPageData) {
    return (
      <div className="flex items-center justify-center p-8">
        <LoaderCircle className="h-8 w-8 animate-spin text-ifpr-green" />
        <p className="ml-2 text-gray-600">Carregando painel...</p>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="text-red-600 flex flex-col items-center gap-4 p-8 bg-red-50 border border-red-200 rounded-xl">
        <AlertTriangle className="h-10 w-10" />
        <p className="font-semibold text-xl">Erro ao carregar os dados do painel.</p>
        <p>Por favor, tente recarregar a página.</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-800">Painel de Controle</h1>
        <p className="mt-2 text-gray-600">
          Visão geral dos atendimentos e acompanhamentos do CNAPNE.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <StatCard
          title="Total de Atendimentos"
          value={totalAtendimentos}
          icon={ClipboardList}
          isLoading={isLoading}
        />
        <StatCard
          title="Total de Acompanhamentos"
          value={totalAcompanhamentos}
          icon={ClipboardCheck}
          isLoading={isLoading}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Bloco de Atendimentos */}
        <div className={`transition-opacity duration-200 ${isFetching ? 'opacity-60' : 'opacity-100'}`}>
          <SessionList
            title="Últimos Atendimentos Registrados"
            sessions={atendimentos}
            icon={ClipboardList}
            isLoading={isLoading}
            basePath="atendimentos"
          />
          {atendimentosPageData && atendimentosPageData.totalPages > 1 && (
            <div className="flex items-center justify-between mt-4">
              <Button
                onClick={() => setAtendimentosPage(atendimentosPageData.number - 1)}
                disabled={atendimentosPageData.first}
              >
                Anterior
              </Button>
              <span className="text-sm text-gray-700">
                Página {atendimentosPageData.number + 1} de {atendimentosPageData.totalPages}
              </span>
              <Button
                onClick={() => setAtendimentosPage(atendimentosPageData.number + 1)}
                disabled={atendimentosPageData.last}
              >
                Próxima
              </Button>
            </div>
          )}
        </div>

        {/* Bloco de Acompanhamentos */}
        <div className={`transition-opacity duration-200 ${isFetching ? 'opacity-60' : 'opacity-100'}`}>
          <SessionList
            title="Últimos Acompanhamentos Registrados"
            sessions={acompanhamentos}
            icon={ClipboardCheck}
            isLoading={isLoading}
            basePath="acompanhamentos"
          />
          {acompanhamentosPageData && acompanhamentosPageData.totalPages > 1 && (
            <div className="flex items-center justify-between mt-4">
              <Button
                onClick={() => setAcompanhamentosPage(acompanhamentosPageData.number - 1)}
                disabled={acompanhamentosPageData.first}
              >
                Anterior
              </Button>
              <span className="text-sm text-gray-700">
                Página {acompanhamentosPageData.number + 1} de {acompanhamentosPageData.totalPages}
              </span>
              <Button
                onClick={() => setAcompanhamentosPage(acompanhamentosPageData.number + 1)}
                disabled={acompanhamentosPageData.last}
              >
                Próxima
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}