"use client";

import { Button, useDisclosure } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { getRooms } from "@/actions/rooms";
import { IoPeopleCircleOutline } from "react-icons/io5";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Room } from "@/types";
import CreateRoomModal from "@/components/CreateRoomModal";
import JoinRoomDialog from "@/components/JoinRoomDialog";
import LoadingScreen from "@/components/LoadingScreen";
import { createClient } from "@/utils/supabase/client";

export default function HomePage() {
  const {
    isOpen: isCreateRoomModalOpen,
    onOpen: onCreateRoomModalOpen,
    onClose: onCreateRoomModalClose,
  } = useDisclosure();
  const searchParams = useSearchParams();
  const join_room_code = searchParams.get("join_room_code");
  const [rooms, setRooms] = useState<Room[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [reloadAvailableRooms, setReloadAvailableRooms] =
    useState<boolean>(false);
  useEffect(() => {
    const supabase = createClient();
    const fetchRooms = async () => {
      setIsLoading(true);
      const rooms = await getRooms();
      console.log(rooms);
      setRooms(rooms ? rooms : []);
      setIsLoading(false);
    };
    fetchRooms().then(res => console.log('primera vez haciendo fetch'));
    const subscription = supabase
      .channel("custom-all-channel")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "room" },
        async (_payload) => {
          console.log("Database change detected");
          fetchRooms();
        }
      )
      .subscribe();

    // Cleanup subscription on unmount
    return () => {
      supabase.removeChannel(subscription);
    };
  }, []);
  return (
    <main className="flex flex-col">
      <LoadingScreen isLoading={isLoading} />
      <JoinRoomDialog
        join_room_code={join_room_code}
        reloadAvailableRooms={reloadAvailableRooms}
        setReloadAvailableRooms={setReloadAvailableRooms}
      />
      <CreateRoomModal
        isOpen={isCreateRoomModalOpen}
        onClose={onCreateRoomModalClose}
      />
      <section className="flex-grow p-6">
        <Button
          onClick={onCreateRoomModalOpen}
          colorScheme="purple"
          className="mb-4 bg-custom-darkenedLighter hover:bg-custom-darkenedLight"
        >
          Crear sala
        </Button>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {rooms.map((room) => (
            <div
              key={room.id}
              className="bg-custom-light p-4 rounded-lg shadow-lg flex flex-col justify-between border border-gray-200"
            >
              <h2 className="text-xl font-semibold text-gray-800">
                {room.room_name}
              </h2>
              <p className="text-gray-600">{room.room_description}</p>
              <span className="flex justify-between items-center mt-4">
                <Link
                  href={`/home/room/${room.id}`}
                  className="px-4 py-2 text-white bg-custom-darkenedLighter hover:bg-custom-darkenedLight rounded-md shadow-md"
                >
                  Entrar
                </Link>
                <button className="px-4 py-2 text-white bg-custom-darkenedLighter hover:bg-custom-darkenedLight rounded-md shadow-md">
                  Opciones
                </button>
                <span className="flex items-center text-gray-600 text-lg">
                  <IoPeopleCircleOutline size={24} />
                  <span className="ml-2">{room.room_members.length}</span>
                </span>
              </span>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
