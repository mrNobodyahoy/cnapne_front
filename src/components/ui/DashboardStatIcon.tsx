
import { Users, Calendar, Check, XCircle, type LucideProps } from "lucide-react";

const iconProps: LucideProps = {
    className: "h-5 w-5",
};

type IconType = 'total' | 'agendados' | 'realizados' | 'cancelados';

interface Props {
    type: IconType;
}

export function DashboardStatIcon({ type }: Props) {
    switch (type) {
        case 'total':
            return <Users {...iconProps} className="text-blue-600" />;
        case 'agendados':
            return <Calendar {...iconProps} className="text-yellow-600" />;
        case 'realizados':
            return <Check {...iconProps} className="text-green-600" />;
        case 'cancelados':
            return <XCircle {...iconProps} className="text-red-600" />;
        default:
            return <Users {...iconProps} className="text-gray-600" />;
    }
}