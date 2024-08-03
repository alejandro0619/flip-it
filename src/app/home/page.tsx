'use client';
import {
  Button,
  useDisclosure,
  AlertDialog,
  AlertDialogOverlay,
  AlertDialogBody,
  AlertDialogContent,
  Tooltip,
  FormLabel,
  Badge,
} from "@chakra-ui/react";
import { useEffect, useRef, useState } from "react";

import { getRoomById, getRooms, joinRoom } from "@/actions/rooms";

import { IoPeopleCircleOutline } from "react-icons/io5";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Room } from "@/types";
import CreateRoomModal from "@/components/CreateRoomModal";
import { useForm } from "react-hook-form";
import Avatar from "@/components/Avatar";
import { JoinRoomSchema, joinRoomSchema } from "@/schemas/rooms";
import { toast } from "react-toastify";
import { zodResolver } from "@hookform/resolvers/zod";
import JoinRoomDialog from "@/components/JoinRoomDialog";
export default function HomePage() {
  const {
    isOpen: isCreateRoomModalOpen,
    onOpen: onCreateRoomModalOpen,
    onClose: onCreateRoomModalClose,
  } = useDisclosure();

  const searchParams = useSearchParams();
  const join_room_code = searchParams.get("join_room_code");
  // Once a searchParams with the code of the room to join is found, the modal is opened and the room information is fetched and stored in this state.

  const [rooms, setRooms] = useState<Room[]>([]);
  const [reloadAvailableRooms, setReloadAvailableRooms] =
    useState<boolean>(false);

  useEffect(() => {
    const fetchRooms = async () => {
      const rooms = await getRooms();
      if (rooms) {
        setRooms(rooms);
      } else {
        setRooms([]);
      }
    };

    fetchRooms();
  }, [reloadAvailableRooms]);

  return (
    <main className="flex flex-col">
      <JoinRoomDialog
        join_room_code={join_room_code}
        reloadAvailableRooms={reloadAvailableRooms}
        setReloadAvailableRooms={setReloadAvailableRooms}
      />
      <CreateRoomModal
        isOpen={isCreateRoomModalOpen}
        onClose={onCreateRoomModalClose}
        reloadAvailableRooms={reloadAvailableRooms}
        setReloadAvailableRooms={setReloadAvailableRooms}
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
