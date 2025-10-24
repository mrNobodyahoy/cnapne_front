import { useState } from "react";
import Sidebar from "./Sidebar";
import { UserMenu } from "./UserMenu";
import Modal from "../ui/Modal";
import { ProfileEditForm } from "../professional/ProfileEditForm";

export function MainLayout({ children }: { children: React.ReactNode }) {
    const [isProfileModalOpen, setProfileModalOpen] = useState(false);

    return (
        <div className="flex h-screen bg-gray-100">
            <Sidebar />

            <div className="flex-1 flex flex-col overflow-hidden">

                <UserMenu onEditProfile={() => setProfileModalOpen(true)} />

                <main className="flex-1 overflow-x-hidden overflow-y-auto">
                    {children}
                </main>
            </div>

            <Modal
                isOpen={isProfileModalOpen}
                onClose={() => setProfileModalOpen(false)}
                title="Meu Perfil"
            >
                <ProfileEditForm onClose={() => setProfileModalOpen(false)} />
            </Modal>
        </div>
    );
}