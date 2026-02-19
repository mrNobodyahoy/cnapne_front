import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getBackups,
  createManualBackup,
  downloadBackup,
  uploadRestoreBackup,
} from "../../services/backupService";

export function useBackup() {
  const queryClient = useQueryClient();

  const {
    data: backups,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["backups"],
    queryFn: getBackups,
  });

  const generateMutation = useMutation({
    mutationFn: createManualBackup,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["backups"] });
      alert("Backup gerado com sucesso!");
    },
    onError: (error: any) => {
      alert("Erro ao gerar backup: " + error.message);
    },
  });

  const restoreMutation = useMutation({
    mutationFn: uploadRestoreBackup,
    onSuccess: () => {
      alert("Sistema restaurado com sucesso! A página será recarregada.");
      window.location.reload();
    },
    onError: (error: any) => {
      alert("Erro ao restaurar sistema: " + error.message);
    },
  });

  const handleDownload = async (nomeArquivo: string) => {
    try {
      await downloadBackup(nomeArquivo);
    } catch (error) {
      alert(
        "Erro ao baixar o arquivo. Verifique se ele ainda existe no servidor.",
      );
    }
  };

  const handleRestore = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const confirm = window.confirm(
      "ATENÇÃO MÁXIMA!\n\nRestaurar um backup apagará as alterações recentes e voltará o sistema para a data do arquivo.\nTem certeza absoluta que deseja continuar?",
    );

    if (confirm) {
      restoreMutation.mutate(file);
    }

    event.target.value = "";
  };

  return {
    backups: backups || [],
    isLoading,
    isError,
    generateBackup: () => generateMutation.mutate(),
    isGenerating: generateMutation.isPending,
    handleDownload,
    handleRestore,
    isRestoring: restoreMutation.isPending,
  };
}
