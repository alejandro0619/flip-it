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
export default function HomePage() {
  const {
    isOpen: isCreateRoomModalOpen,
    onOpen: onCreateRoomModalOpen,
    onClose: onCreateRoomModalClose,
  } = useDisclosure();
  const {
    isOpen: isJoinRoomModalOpen,
    onOpen: onJoinRoomModalOpen,
    onClose: onJoinRoomModalClose,
  } = useDisclosure();

  const searchParams = useSearchParams();
  const join_room_code = searchParams.get("join_room_code");
  // Once a searchParams with the code of the room to join is found, the modal is opened and the room information is fetched and stored in this state.
  const [room_to_join, set_room_to_join] = useState<Room | null>(null);
  const [rooms, setRooms] = useState<Room[]>([]);
  const [reloadAvailableRooms, setReloadAvailableRooms] =
    useState<boolean>(false);
  const cancelJoin = useRef(null);

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

  useEffect(() => {
    if (join_room_code) {
      getRoomById(join_room_code).then((room) => {
        if (room) {
          set_room_to_join(room);
        }
        onJoinRoomModalOpen();
      });
    }
  }, [join_room_code]);
  const {
    register: joinRoomRegister,
    handleSubmit: joinRoomHandleSubmit,
    formState: { errors: joinRoomErrors },
  } = useForm<JoinRoomSchema>({
    mode: "onChange",
    resolver: zodResolver(joinRoomSchema),
  });

  const joinRoomSubmit = () => (data: JoinRoomSchema) => {
    console.log("data", data);
    if (room_to_join) {
      joinRoom(room_to_join.id, data.room_password).then(
        ({ error, message, payload }) => {
          console.log("error", error, "message", message, "payload", payload);
          if (!error) {
            setReloadAvailableRooms(!reloadAvailableRooms);
            onJoinRoomModalClose();
            toast.success("¡Te has unido a la sala exitosamente!");
          } else {
            toast.error(message || "Error al unirte a la sala");
          }
        }
      );
    }
  };

  return (
    <main className="flex flex-col">
      <AlertDialog
        isOpen={isJoinRoomModalOpen}
        onClose={onJoinRoomModalClose}
        leastDestructiveRef={cancelJoin}
      >
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogBody>
              {room_to_join ? (
                <div className="flex flex-col gap-4">
                  <h2 className="text-2xl text-center font-semibold my-2">
                    Bienvenido a bordo 🚀
                  </h2>
                  {!room_to_join.is_public ? (
                    <>
                      <section className="flex flex-col items-center justify-center h-[300px]">
                        <div className="flex flex-col items-center justify-center bg-custom-lighter h-full w-[300px] rounded-lg px-4">
                          <Avatar
                            placeholder={room_to_join.room_name}
                            style="shape"
                            size={80}
                          />
                          <p className="mt-4 text-lg font-medium truncate max-w-full">
                            {room_to_join.room_name}
                          </p>
                          <p className="text-gray-700 truncate max-w-full">
                            {room_to_join.room_description}
                          </p>
                          <Tooltip
                            label={"Hay hechizeros en la sala"}
                            placement="top"
                          >
                            <p className="text-gray-700">
                              {room_to_join.room_members.length} 🧙 en la sala
                            </p>
                          </Tooltip>
                          <span className="flex text-center items-center mt-2">
                            <Badge
                              colorScheme={`${
                                room_to_join.is_public ? "green" : "yellow"
                              }`}
                              size={"lg"}
                            >
                              {" "}
                              {room_to_join.is_public
                                ? "SALA PÚBLICA"
                                : "SALA PRIVADA"}
                            </Badge>
                          </span>
                        </div>
                      </section>
                      <form
                        onSubmit={(data) => {
                          joinRoomHandleSubmit(joinRoomSubmit())(data);
                        }}
                      >
                        <FormLabel className="text-2xl">
                          Ingresa la contraseña de la sala
                        </FormLabel>
                        <input
                          type="text"
                          placeholder="Contraseña"
                          className="border border-gray-200 p-2 rounded-lg w-full mb-4"
                          {...joinRoomRegister("room_password")}
                        />
                        {joinRoomErrors.room_password && (
                          <p className="text-red-500 text-sm">
                            {joinRoomErrors.room_password.message}
                          </p>
                        )}
                        <div className="flex justify-end">
                          <Button
                            onClick={onJoinRoomModalClose}
                            colorScheme="gray"
                            className="bg-custom-darkenedLighter hover:bg-custom-darkenedLight mr-2"
                          >
                            Cancelar
                          </Button>
                          <Button
                            type="submit"
                            colorScheme="purple"
                            className="bg-custom-darkenedLighter hover:bg-custom-darkenedLight"
                          >
                            Unirse
                          </Button>
                        </div>
                      </form>
                    </>
                  ) : (
                    <div className="flex flex-col items-center justify-center h-[300px]">
                      <div className="flex flex-col items-center justify-center bg-custom-lighter h-full w-[300px] rounded-lg px-4">
                        <Avatar
                          placeholder={room_to_join.room_name}
                          style="shape"
                          size={80}
                        />
                        <p className="mt-4 text-lg font-medium truncate max-w-full">
                          {room_to_join.room_name}
                        </p>
                        <p className="text-gray-700 truncate max-w-full">
                          {room_to_join.room_description}
                        </p>
                        <Tooltip
                          label={"Hay hechizeros en la sala"}
                          placement="top"
                        >
                          <p className="text-gray-700">
                            {room_to_join.room_members.length} 🧙 en la sala
                          </p>
                        </Tooltip>
                        <span className="flex text-center items-center mt-2">
                          <Badge
                            colorScheme={`${
                              room_to_join.is_public ? "red" : "green"
                            }`}
                            size={"lg"}
                          >
                            {" "}
                            {room_to_join.is_public
                              ? "SALA PÚBLICA"
                              : "SALA PRIVADA"}
                          </Badge>
                        </span>
                      </div>
                      <div className="flex justify-end mt-5">
                        <Button
                          onClick={() => {
                            joinRoom(room_to_join.id).then(
                              ({ message, error, payload }) => {
                                if (!error) {
                                  setReloadAvailableRooms(
                                    !reloadAvailableRooms
                                  );
                                  onJoinRoomModalClose();
                                  toast.success(
                                    "¡Te has unido a la sala exitosamente!"
                                  );
                                } else {
                                  toast.error(
                                    message || "Error al unirte a la sala"
                                  );
                                }
                              }
                            );
                          }}
                          className="bg-custom-darkenedLighter hover:bg-custom-darkenedLight mr-2"
                        >
                          Unirse
                        </Button>
                        <Button
                          onClick={onJoinRoomModalClose}
                          className="bg-custom-darkenedLighter hover:bg-custom-darkenedLight"
                        >
                          Salir
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <>
                  <h2 className="text-2xl font-semibold mb-4">
                    😥 ¡Woops! Un error ha ocurrido.
                  </h2>
                  <p>Es posible que el link haya sido el equivocado 😴.</p>

                  <div className="flex justify-end mt-5">
                    <Button
                      onClick={onJoinRoomModalClose}
                      className="bg-custom-darkenedLighter hover:bg-custom-darkenedLight mr-2"
                    >
                      Salir
                    </Button>
                  </div>
                </>
              )}
            </AlertDialogBody>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
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
