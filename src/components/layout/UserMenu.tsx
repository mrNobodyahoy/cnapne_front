import { Pencil } from 'lucide-react';
import { useUserProfile } from '../../hooks/professional/useUserProfile';

interface UserMenuProps {
    onEditProfile: () => void;
}

export function UserMenu({ onEditProfile }: UserMenuProps) {
    const { data: profile, isLoading } = useUserProfile();

    if (isLoading || !profile) {
        return <header className="bg-white border-b p-4 h-[73px]"></header>;
    }

    return (
        <header className="bg-white border-b px-6 py-4 flex justify-end items-center">
            <div className="flex items-center gap-4">
                <div className="text-right">
                    <p className="font-bold text-gray-800 text-md">{profile.fullName}</p>
                    <p className="text-sm text-gray-500">{profile.role.replace(/_/g, " ")}</p>
                </div>
                <button
                    onClick={onEditProfile}
                    className="p-2 text-gray-600 hover:bg-gray-100 hover:text-blue-600 rounded-full transition"
                    title="Editar Perfil"
                >
                    <Pencil className="h-5 w-5" />
                </button>
            </div>
        </header>
    );
}