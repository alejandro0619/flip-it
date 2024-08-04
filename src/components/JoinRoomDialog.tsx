import { getRoomById, joinRoom } from "@/actions/rooms";
import {
  AlertDialog,
  AlertDialogOverlay,
  AlertDialogContent,
  AlertDialogBody,
  Tooltip,
  Badge,
  FormLabel,
  Button,
  useDisclosure,
} from "@chakra-ui/react";
import { toast } from "react-toastify";
import Avatar from "@/components/Avatar";
import { JoinRoomSchema, joinRoomSchema } from "@/schemas/rooms";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useEffect, useRef, useState } from "react";
import { Room } from "@/types";

export default function JoinRoomDialog({ join_room_code }: { join_room_code: string | null }) {
  const cancelJoin = useRef(null);
  const [room_to_join, set_room_to_join] = useState<Room | null>(null);
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
  const {
    isOpen: isJoinRoomModalOpen,
    onOpen: onJoinRoomModalOpen,
    onClose: onJoinRoomModalClose,
  } = useDisclosure();

  const joinRoomSubmit = () => (data: JoinRoomSchema) => {
    console.log("data", data);
    if (room_to_join) {
      joinRoom(room_to_join.id, data.room_password).then(
        ({ error, message, payload }) => {
          console.log("error", error, "message", message, "payload", payload);
          if (!error) {
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
  );
}
