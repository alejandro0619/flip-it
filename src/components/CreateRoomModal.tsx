import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  Button,
  FormLabel,
  Switch,
  HStack,
  Input,
  FormControl,
  FormErrorMessage,
  ModalOverlay,
} from "@chakra-ui/react";
import { useState } from "react";
import { FieldErrors, useForm } from "react-hook-form";
import { createRoomSchema, CreateRoomSchema } from "@/schemas/rooms";
import { zodResolver } from "@hookform/resolvers/zod";
import { insertMemberInRoom, insertRoom } from "@/actions/rooms";
import { toast } from "react-toastify";
import { FaLock, FaUnlock } from "react-icons/fa";

export default function CreateRoomModal({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<CreateRoomSchema>({
    resolver: zodResolver(createRoomSchema),
    mode: "onChange",
    shouldFocusError: true,
    delayError: 100,
    reValidateMode: "onChange",
  });

  const [isPublic, setIsPublic] = useState(true);

  const onSubmit = async (data: CreateRoomSchema) => {
    try {
      const roomData = { ...data, is_public: isPublic };
      if (!isPublic && !data.room_password) {
        throw new Error("La contraseña es requerida para las salas privadas");
      }
      const roomResponse = await insertRoom(roomData);
      toast.success(roomResponse.message ?? "Sala creada satisfactoriamente");

      const memberResponse = await insertMemberInRoom(
        roomResponse.payload as string,
        "ADMIN" // The user that creates the room is the admin
      );
      toast.success(memberResponse.message ?? "Te has unido a la sala");

      reset();
      onClose();
    } catch (error: any) {
      toast.error(error.message ?? "Error al crear la sala");
    }
  };

  const onError = (errors: FieldErrors) => {
    Object.keys(errors).forEach((err) => {
      toast.error(errors[err]?.message as string);
    });
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay/>
      <ModalContent>
        <ModalHeader>Crear una sala</ModalHeader>
        <ModalBody>
          <form onSubmit={handleSubmit(onSubmit, onError)}>
            <FormLabel>Nombre de la sala</FormLabel>
            <Input
              type="text"
              {...register("name")}
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-customLight"
            />
            {errors.name && (
              <span className="text-red-500">{errors.name.message}</span>
            )}

            <FormLabel>Descripción de la Sala</FormLabel>
            <Input
              {...register("description")}
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-customLight"
            />
            {errors.description && (
              <span className="text-red-500">{errors.description.message}</span>
            )}

            <FormLabel>Tipo de sala:</FormLabel>
            <div className="flex gap-2 mt-2 items-center">
              <Switch
                onChange={() => {
                  setIsPublic(!isPublic);
                  console.log(isPublic);
                }}
                size={"lg"}
              />
              <p className="text-2xl">{isPublic ? "🔓" : "🔒"} </p>
            </div>

            {!isPublic && (
              <FormControl isInvalid={Boolean(errors.room_password)} mt={4}>
                <FormLabel>Contraseña de la sala</FormLabel>
                <Input
                  type="password"
                  {...register("room_password", {
                    required: !isPublic,
                  })}
                  className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-customLight"
                />
                <FormErrorMessage>
                  {errors.room_password && errors.room_password.message}
                </FormErrorMessage>
              </FormControl>
            )}

            <Button type="submit" mt={4} colorScheme="purple">
              Guardar
            </Button>
          </form>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
}
