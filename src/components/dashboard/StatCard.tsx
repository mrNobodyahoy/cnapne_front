import { type LucideIcon } from "lucide-react";

interface StatCardProps {
    title: string;
    value: number | string;
    icon: LucideIcon;
    isLoading: boolean;
}

export default function StatCard({ title, value, icon: Icon, isLoading }: StatCardProps) {
    return (
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm flex items-center gap-4">
            <div className="bg-green-100 p-3 rounded-full">
                <Icon className="h-6 w-6 text-ifpr-green" />
            </div>
            <div>
                <p className="text-sm text-gray-500">{title}</p>
                {isLoading ? (
                    <div className="h-7 w-12 bg-gray-200 rounded-md animate-pulse mt-1" />
                ) : (
                    <p className="text-2xl font-bold text-gray-900">{value}</p>
                )}
            </div>
        </div>
    );
}