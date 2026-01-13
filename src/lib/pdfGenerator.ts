import jsPDF from "jspdf";
import { format, parseISO } from "date-fns";
import { ptBR } from "date-fns/locale";
import type { ReadTeacherGuidance } from "../types/teacherGuidance";

import cnapneLogoMaior from "../assets/marca-cnapne-barracao_vertical-1024x933.png";

const addWrappedText = (
  doc: jsPDF,
  text: string | null | undefined,
  x: number,
  y: number,
  maxWidth: number,
  lineHeight: number
): number => {
  if (!text) return y;
  const lines = doc.splitTextToSize(text, maxWidth);
  doc.text(lines, x, y);
  return y + lines.length * lineHeight;
};

export const generateGuidancePdf = (guidance: ReadTeacherGuidance) => {
  const doc = new jsPDF();
  const pageHeight = doc.internal.pageSize.height;
  const pageWidth = doc.internal.pageSize.width;
  const margin = 15;
  const contentWidth = pageWidth - margin * 2;
  let currentY = margin + 10;

  // --- Cores e Estilos Padrão ---
  const primaryColor = "#217346"; // Verde do IFPR/CNAPNE
  const grayColor = "#555555";
  const lightGrayColor = "#DDDDDD";

  // --- Adicionar Logomarcas ---
  // CNAPNE (maior) - centralizada no topo
  const cnapneLogoPath = cnapneLogoMaior; // Variável importada
  const cnapneLogoWidth = 60;
  const cnapneLogoHeight = 35;
  try {
    doc.addImage(
      cnapneLogoPath,
      "PNG",
      (pageWidth - cnapneLogoWidth) / 2,
      margin,
      cnapneLogoWidth,
      cnapneLogoHeight
    );
    currentY = margin + cnapneLogoHeight + 10;
  } catch (error) {
    console.error("Erro ao adicionar logo CNAPNE:", error);
    currentY = margin + 10; // Continua sem a logo se der erro
  }

  // --- Título do Relatório ---
  doc.setFontSize(18);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(primaryColor);
  doc.text("Relatório de Orientação Pedagógica", pageWidth / 2, currentY, {
    align: "center",
  });
  currentY += 15;
  doc.setTextColor(grayColor);

  // --- Dados Gerais ---
  doc.setFontSize(12);
  doc.setFont("helvetica", "bold");
  doc.text("Dados Gerais", margin, currentY);
  currentY += 6;
  doc.setLineWidth(0.3);
  doc.setDrawColor(lightGrayColor);
  doc.line(margin, currentY, pageWidth - margin, currentY);
  currentY += 8;

  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  const lineHeight = 5;

  // Aluno
  doc.setFont("helvetica", "bold");
  doc.text("Aluno(a):", margin, currentY);
  doc.setFont("helvetica", "normal");
  doc.text(guidance.student.completeName, margin + 25, currentY);

  // Matrícula
  doc.setFont("helvetica", "bold");
  doc.text("Matrícula:", margin + contentWidth / 2, currentY);
  doc.setFont("helvetica", "normal");
  doc.text(
    guidance.student.registration || "N/A",
    margin + contentWidth / 2 + 25,
    currentY
  );
  currentY += lineHeight;

  // Turma
  doc.setFont("helvetica", "bold");
  doc.text("Turma:", margin + contentWidth / 2, currentY);
  doc.setFont("helvetica", "normal");
  doc.text(
    guidance.student.team || "N/A",
    margin + contentWidth / 2 + 25,
    currentY
  );
  currentY += lineHeight * 2;

  // Autor
  doc.setFont("helvetica", "bold");
  doc.text("Autor(a) da Orientação:", margin, currentY);
  doc.setFont("helvetica", "normal");
  doc.text(guidance.author.fullName, margin + 50, currentY);
  currentY += lineHeight;

  // Especialidade
  doc.setFont("helvetica", "bold");
  doc.text("Especialidade:", margin, currentY);
  doc.setFont("helvetica", "normal");
  doc.text(guidance.author.specialty, margin + 50, currentY);
  currentY += lineHeight * 2;

  // Data do Registro
  doc.setFont("helvetica", "bold");
  doc.text("Data do Registro:", margin, currentY);
  doc.setFont("helvetica", "normal");
  doc.text(
    format(parseISO(guidance.createdAt), "dd/MM/yyyy 'às' HH:mm", {
      locale: ptBR,
    }),
    margin + 35,
    currentY
  );

  // Local
  doc.setFont("helvetica", "bold");
  doc.text("Local:", margin + contentWidth / 2, currentY);
  doc.setFont("helvetica", "normal");
  doc.text(
    guidance.domiciliar ? "Domiciliar" : "Sala de Aula",
    margin + contentWidth / 2 + 15,
    currentY
  );
  currentY += 15;

  // --- Detalhes da Orientação ---
  doc.setFontSize(12);
  doc.setFont("helvetica", "bold");
  doc.text("Detalhes da Orientação", margin, currentY);
  currentY += 6;
  doc.line(margin, currentY, pageWidth - margin, currentY);
  currentY += 8;

  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");
  currentY = addWrappedText(
    doc,
    guidance.guidanceDetails,
    margin,
    currentY,
    contentWidth,
    lineHeight
  );
  currentY += 10;

  // --- Recomendações / Encaminhamentos ---
  doc.setFontSize(12);
  doc.setFont("helvetica", "bold");
  doc.text("Recomendações / Encaminhamentos", margin, currentY);
  currentY += 6;
  doc.line(margin, currentY, pageWidth - margin, currentY);
  currentY += 8;

  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");
  currentY = addWrappedText(
    doc,
    guidance.recommendations,
    margin,
    currentY,
    contentWidth,
    lineHeight
  );

  // --- Rodapé ---
  doc.setFontSize(8);
  doc.setTextColor(grayColor);
  doc.text(
    `Gerado em: ${format(new Date(), "dd/MM/yyyy HH:mm", { locale: ptBR })}`,
    margin,
    pageHeight - 10
  );
  const pageNumText = `Página ${doc.internal.pages.length}`;
  doc.text(pageNumText, pageWidth - margin - 10, pageHeight - 10);

  // --- Salvar o PDF ---
  const studentNameSafe = guidance.student.completeName.replace(
    /[^a-zA-Z0-9]/g,
    "_"
  );
  const dateStr = format(parseISO(guidance.createdAt), "yyyyMMdd");
  const fileName = `Orientacao_${studentNameSafe}_${dateStr}.pdf`;
  doc.save(fileName);
};
