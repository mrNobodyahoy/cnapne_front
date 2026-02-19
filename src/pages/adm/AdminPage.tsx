import { Database, Download, AlertCircle, CheckCircle, Clock, LoaderCircle, Upload } from "lucide-react";
import { useBackup } from "../../hooks/admin/useBackup";

export default function AdminPage() {
    const {
        backups,
        isLoading,
        isError,
        generateBackup,
        isGenerating,
        handleDownload,
        handleRestore,
        isRestoring
    } = useBackup();

    const formatDate = (isoString: string) => {
        return new Date(isoString).toLocaleString("pt-BR", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        });
    };

    return (
        <div className="w-full min-h-screen bg-gray-50/50 p-6">
            <div className="max-w-6xl mx-auto space-y-6">

                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Página de Admin</h1>
                    <p className="text-gray-600 mt-1">Gerencie a segurança e os backups do sistema.</p>
                </div>

                <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-blue-50 text-blue-600 rounded-full">
                            <Database className="h-6 w-6" />
                        </div>
                        <div>
                            <h2 className="text-lg font-semibold text-gray-800">Backup do Banco de Dados</h2>
                            <p className="text-sm text-gray-500">
                                Os backups automáticos ocorrem diariamente às 03:00 da manhã.
                            </p>
                        </div>
                    </div>
                    <button
                        onClick={generateBackup}
                        disabled={isGenerating || isRestoring}
                        className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white text-sm font-medium rounded-md hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {isGenerating ? (
                            <>
                                <LoaderCircle className="h-4 w-4 animate-spin" />
                                Gerando...
                            </>
                        ) : (
                            <>
                                <Database className="h-4 w-4" />
                                Gerar Backup Agora
                            </>
                        )}
                    </button>
                </div>

                <div className="bg-red-50 rounded-lg border border-red-200 shadow-sm p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-red-100 text-red-600 rounded-full">
                            <Upload className="h-6 w-6" />
                        </div>
                        <div>
                            <h2 className="text-lg font-semibold text-red-800">Restaurar Sistema</h2>
                            <p className="text-sm text-red-600">
                                Atenção: Carregar um backup antigo substituirá todos os dados atuais do banco.
                            </p>
                        </div>
                    </div>
                    <div className="relative">
                        <input
                            type="file"
                            accept=".sql"
                            onChange={handleRestore}
                            disabled={isRestoring || isGenerating}
                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-not-allowed"
                        />
                        <button
                            disabled={isRestoring || isGenerating}
                            className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white text-sm font-medium rounded-md hover:bg-red-700 transition-colors disabled:opacity-50"
                        >
                            {isRestoring ? (
                                <>
                                    <LoaderCircle className="h-4 w-4 animate-spin" />
                                    Restaurando...
                                </>
                            ) : (
                                <>
                                    <Upload className="h-4 w-4" />
                                    Carregar Arquivo .sql
                                </>
                            )}
                        </button>
                    </div>
                </div>

                <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
                    <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
                        <h3 className="font-semibold text-gray-800">Histórico de Backups</h3>
                    </div>

                    {isLoading ? (
                        <div className="flex justify-center items-center p-12">
                            <LoaderCircle className="h-8 w-8 animate-spin text-green-600" />
                        </div>
                    ) : isError ? (
                        <div className="p-6 text-center text-red-600">
                            Erro ao carregar o histórico de backups.
                        </div>
                    ) : backups.length === 0 ? (
                        <div className="p-12 text-center text-gray-500 flex flex-col items-center">
                            <Clock className="h-10 w-10 text-gray-300 mb-3" />
                            <p>Nenhum backup encontrado no sistema ainda.</p>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full text-left text-sm text-gray-600">
                                <thead className="bg-gray-50 border-b border-gray-200 text-gray-700">
                                    <tr>
                                        <th className="px-6 py-3 font-medium">Data e Hora</th>
                                        <th className="px-6 py-3 font-medium">Tipo</th>
                                        <th className="px-6 py-3 font-medium">Status</th>
                                        <th className="px-6 py-3 font-medium">Arquivo</th>
                                        <th className="px-6 py-3 font-medium text-right">Ações</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200">
                                    {backups.map((log) => (
                                        <tr key={log.id} className="hover:bg-gray-50 transition-colors">
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                {formatDate(log.dataHora)}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className={`px-2 py-1 rounded text-xs font-semibold ${log.tipo === 'AUTOMATICO' ? 'bg-blue-100 text-blue-700' : 'bg-purple-100 text-purple-700'
                                                    }`}>
                                                    {log.tipo}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                {log.status === "SUCESSO" ? (
                                                    <div className="flex items-center text-green-600 gap-1.5">
                                                        <CheckCircle className="h-4 w-4" />
                                                        <span className="font-medium">Sucesso</span>
                                                    </div>
                                                ) : (
                                                    <div className="flex items-center text-red-600 gap-1.5" title={log.mensagemErro || "Erro"}>
                                                        <AlertCircle className="h-4 w-4" />
                                                        <span className="font-medium">Erro</span>
                                                    </div>
                                                )}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-gray-500">
                                                {log.nomeArquivo || "-"}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-right">
                                                {log.status === "SUCESSO" && log.nomeArquivo && (
                                                    <button
                                                        onClick={() => handleDownload(log.nomeArquivo as string)}
                                                        className="inline-flex items-center gap-1.5 text-blue-600 hover:text-blue-800 font-medium"
                                                    >
                                                        <Download className="h-4 w-4" />
                                                        Baixar
                                                    </button>
                                                )}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>

            </div>
        </div>
    );
}