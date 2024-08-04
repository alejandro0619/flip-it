"use client";

import { Button, useDisclosure } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { getRooms } from "@/actions/rooms";
import { IoPeopleCircleOutline, IoPersonCircleOutline } from "react-icons/io5";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Room } from "@/types";
import CreateRoomModal from "@/components/CreateRoomModal";
import JoinRoomDialog from "@/components/JoinRoomDialog";
import LoadingScreen from "@/components/LoadingScreen";
import { createClient } from "@/utils/supabase/client";
import Avatar from "@/components/Avatar";

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
  const supabase = createClient();
  useEffect(() => {
    const fetchRooms = async () => {
      setIsLoading(true);
      const rooms = await getRooms();
      setRooms(rooms ? rooms : []);
      setIsLoading(false);
    };
    fetchRooms();
    // When the room is created, we reload the available rooms
    const subscription_room_changes = supabase
      .channel("custom-all-channel")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "room" },
        async (_payload) => {
          console.log("se ha creado una sala", _payload);
          fetchRooms();
        }
      )
      .subscribe();
    // When a user joins or leaves a room, we reload the available rooms, whether to increment or decrement the number of members
    const subscription_room_members_changes = supabase
      .channel("custom-all-channel")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "room_members" },
        async (_payload) => {
          console.log(
            "se ha unido alguien o salido alguien de una sala",
            _payload
          );
          fetchRooms();
        }
      ).subscribe();
    // Cleanup subscription on unmount
    return () => {
      supabase.removeChannel(subscription_room_changes);
      supabase.removeChannel(subscription_room_members_changes);
    };
  }, []);
  return (
    <main className="flex flex-col">
      <LoadingScreen isLoading={isLoading} />
      <JoinRoomDialog
        join_room_code={join_room_code}
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
              className="bg-custom-light p-6 rounded-lg shadow-lg flex flex-col justify-between border border-gray-200 hover:bg-gray-100 transition duration-300"
            >
              <div className="flex items-center mb-4 gap-2">
                <Avatar placeholder={room.room_name} size={50} style="shape" />
                <h2 className="text-xl font-semibold text-gray-800 truncate max-w-xs">
                  {room.room_name}
                </h2>
              </div>
              <p className="text-gray-600 mb-4">{room.room_description}</p>
              <div className="flex justify-between items-center mt-4">
                <Link
                  href={`/home/room/${room.id}`}
                  className="px-4 py-2 text-white bg-custom-darkenedLighter hover:bg-custom-darkenedLight rounded-md shadow-md transition duration-300"
                >
                  Entrar
                </Link>
                <div className="flex items-center text-gray-600 text-lg">
                  <IoPersonCircleOutline size={24} />
                  <span className="ml-2">{room.room_members.length}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
