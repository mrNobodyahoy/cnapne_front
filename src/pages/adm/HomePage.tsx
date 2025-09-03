export default function HomePage() {
  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-800">Página Inicial</h1>
      <p className="mt-2 text-gray-600">
        Bem-vindo(a) ao painel do sistema CNAPNE.
      </p>
      <div className="mt-8 rounded-lg border bg-white p-6">
        <h2 className="text-xl font-semibold">Dashboard</h2>
        <p className="mt-2">Aqui ficarão seus gráficos e informações importantes.</p>
      </div>
    </div>
  );
}