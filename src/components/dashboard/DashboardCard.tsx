import type { ReactNode } from "react";

interface DashboardCardProps {
    title: string;
    icon: ReactNode;
    value: string | number;
    description?: string;
    color?: string;
}

export function DashboardCard({ title, icon, value, description, color = "bg-ifpr-green/10" }: DashboardCardProps) {
    return (
        <div className="flex flex-col justify-between rounded-2xl border border-gray-200 bg-white p-5 shadow-sm hover:shadow-md transition-all">
            <div className="flex items-center justify-between">
                <h3 className="text-sm font-semibold text-gray-600">{title}</h3>
                <div className={`p-2 rounded-xl ${color}`}>{icon}</div>
            </div>
            <p className="mt-2 text-3xl font-bold text-gray-900">{value}</p>
            {description && <p className="text-xs text-gray-500 mt-1">{description}</p>}
        </div>
    );
}
