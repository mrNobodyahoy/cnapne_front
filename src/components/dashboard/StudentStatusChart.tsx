import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip, Legend } from 'recharts';

interface ChartProps {
    data: { status: string; count: number }[];
}

const COLORS = ['#16a34a', '#ef4444', '#f59e0b', '#3b82f6'];

export default function StudentStatusChart({ data }: ChartProps) {
    return (
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">Distribuição de Alunos por Status</h2>
            <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                    <Pie
                        data={data}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        outerRadius={110}
                        fill="#8884d8"
                        dataKey="count"
                        nameKey="status"
                        label={({ name, percent }) => `${name} ${((percent as number) * 100).toFixed(0)}%`}
                    >
                        {data.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                    </Pie>
                    <Tooltip formatter={(value) => [value, 'Alunos']} />
                    <Legend />
                </PieChart>
            </ResponsiveContainer>
        </div>
    );
}