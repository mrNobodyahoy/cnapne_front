export default function AuthCard({ children, title }: { children: React.ReactNode; title: string }) {
  return (
    <div className="mx-auto w-full max-w-sm rounded-xl border bg-white p-6 shadow">
      <h1 className="mb-4 text-center text-xl font-semibold">{title}</h1>
      {children}
    </div>
  );
}
