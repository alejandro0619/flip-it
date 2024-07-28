'use client';
import { redirect } from 'next/navigation';
import { createClient } from '@/utils/supabase/client';
import Avatar from '@/components/Avatar';
import { Button, useDisclosure } from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import { User } from '@supabase/supabase-js';
import CreateRoomModal from '@/components/CreateRoomModal';

export default function HomePage() {
  const supabase = createClient();
  const {
    isOpen: isCreateRoomModalOpen,
    onOpen: onCreateRoomModalOpen,
    onClose: onCreateRoomModalClose,
  } = useDisclosure();
  const [user, setUser] = useState<User>();

  useEffect(() => {
    const fetchUser = async () => {
      const { data, error } = await supabase.auth.getUser();
      if (error || !data?.user) {
        redirect('/auth');
      } else {
        setUser(data.user);
      }
    };

    fetchUser();
  }, [supabase]);

  useEffect(() => {
    console.log('Modal state:', isCreateRoomModalOpen);
  }, [isCreateRoomModalOpen]);

  return (
    <main className="h-full w-full z-10">
      <CreateRoomModal isOpen={isCreateRoomModalOpen} onClose={onCreateRoomModalClose} />
      <nav className="fixed z-20 top-0 h-[100px] w-full flex justify-between items-center bg-black shadow-md text-white px-4">
        Bienvenido...
        <Avatar placeholder={user?.email || user?.user_metadata.name} />
      </nav>
      <section className="mt-[100px] bg-red-400">
        <Button onClick={onCreateRoomModalOpen}>Crear sala</Button>
      </section>
    </main>
  );
}
