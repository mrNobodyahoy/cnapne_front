import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, Legend } from "recharts";

interface ChartProps {
    data: { name: string; atendimentos: number; acompanhamentos: number }[];
}

export default function DashboardChart({ data }: ChartProps) {
    return (
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">Evolução Mensal</h2>
            <ResponsiveContainer width="100%" height={300}>
                <LineChart data={data}>
                    <XAxis dataKey="name" stroke="#6b7280" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line
                        type="monotone"
                        dataKey="atendimentos"
                        stroke="#16a34a"
                        strokeWidth={2}
                        dot={{ r: 4 }}
                    />
                    <Line
                        type="monotone"
                        dataKey="acompanhamentos"
                        stroke="#2563eb"
                        strokeWidth={2}
                        dot={{ r: 4 }}
                    />
                </LineChart>
            </ResponsiveContainer>
        </div>
    );
}
