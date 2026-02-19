export interface BackupLog {
  id: number;
  dataHora: string;
  tipo: "AUTOMATICO" | "MANUAL";
  status: "SUCESSO" | "ERRO";
  nomeArquivo: string | null;
  mensagemErro: string | null;
}
