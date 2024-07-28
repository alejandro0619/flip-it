'use client';
import { redirect } from 'next/navigation';
import { createClient } from '@/utils/supabase/client';
import Avatar from '@/components/Avatar';
import { Button, useDisclosure } from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import { User } from '@supabase/supabase-js';
import CreateRoomModal from '@/components/CreateRoomModal';
import { getRooms } from "@/actions/rooms";
import Link from "next/link";
import { IoPeopleCircleOutline } from "react-icons/io5";

export default function HomePage() {
  const supabase = createClient();
  const {
    isOpen: isCreateRoomModalOpen,
    onOpen: onCreateRoomModalOpen,
    onClose: onCreateRoomModalClose,
  } = useDisclosure();
  const [user, setUser] = useState<User>();
  const [rooms, setRooms] = useState<any[]>([]);
  getRooms().then((rooms) => {
    setRooms(rooms);
  });
  supabase.auth.getUser().then(({ data, error }) => {
    if (error || !data?.user) {
      redirect("/auth");
    } else {
      setUser(data.user);
    }
  });
  useEffect(() => {
    console.log("Modal state:", isCreateRoomModalOpen);
  }, [isCreateRoomModalOpen]);

  return (
    <main className="min-h-screen flex flex-col">
      <CreateRoomModal
        isOpen={isCreateRoomModalOpen}
        onClose={onCreateRoomModalClose}
      />
      <nav className="fixed top-0 h-[100px] w-full flex justify-between items-center bg-black shadow-md text-white px-4">
        Bienvenido...
        <Avatar placeholder={user?.email || user?.user_metadata.name} />
      </nav>
      <section className="flex-grow mt-[100px] p-4 bg-red-400">
        <Button onClick={onCreateRoomModalOpen}>Crear sala</Button>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-2 overflow-y-auto">
          {rooms.map((room) => (
            <div
              key={room.id}
              className="bg-white p-4 rounded-md shadow-md flex flex-col justify-between"
            >
              <h2 className="text-lg font-semibold">{room.room_name}</h2>
              <p>{room.room_description}</p>
              <span className="flex justify-between items-center">
                <Link
                  href={`/home/room/${room.id}`}
                  className="mt-4 inline-block px-6 py-2 text-white bg-blue-500 hover:bg-blue-600 rounded-md shadow-md"
                >
                  {" "}
                  Entrar{" "}
                </Link>
                <button className="mt-4 inline-block px-6 py-2 text-white bg-blue-500 hover:bg-blue-600 rounded-md shadow-md">
                  Opciones
                </button>
                
                <IoPeopleCircleOutline size={30} />
                <p>{room.member}</p>
                
              </span>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
