import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from '../components/layout/Sidebar';
import { UserMenu } from '../components/layout/UserMenu';
import Modal from '../components/ui/Modal';
import { ProfileEditForm } from '../components/professional/ProfileEditForm';
import { useAuth } from '../store/auth';
import { LoaderCircle } from 'lucide-react';

export default function AppLayout() {
  const [isProfileModalOpen, setProfileModalOpen] = useState(false);
  const { session } = useAuth();
  if (!session) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <LoaderCircle className="h-10 w-10 animate-spin text-ifpr-green" />
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar />
      <div className="ml-64 flex flex-1 flex-col overflow-hidden">

        <UserMenu onEditProfile={() => setProfileModalOpen(true)} />

        <main className="flex-1 overflow-y-auto">
          <Outlet />
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