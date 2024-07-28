import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  Button,
  FormLabel,
} from "@chakra-ui/react";
import { FieldErrors, useForm } from "react-hook-form";
import { createRoomSchema, CreateRoomSchema } from "@/schemas/rooms";
import { zodResolver } from "@hookform/resolvers/zod";
import { insertRoom } from "@/actions/rooms";
import { toast } from "react-toastify";
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

  const onSubmit = (data: CreateRoomSchema) => {
    insertRoom(data).then(res => {
      toast.success(res.payload ?? "Sala creada satisfactoriamente");
      onClose();
      reset()
    })
  };

  const onError = (errors: FieldErrors) => {
    Object.keys(errors).forEach((err) => {
      toast.error(errors[err]?.message as string);
    });
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalContent>
        <ModalHeader>Crear una sala</ModalHeader>
        <ModalBody>
          <form onSubmit={handleSubmit(onSubmit, onError)}>
            <FormLabel>Nombre de la sala</FormLabel>
            <input
              type="text"
              {...register("name")}
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-customLight"
            />
            {errors.name && (
              <span className="text-red-500">{errors.name.message}eeee</span>
            )}

            <FormLabel>Descripción de la Sala</FormLabel>
            <input
              {...register("description")}
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-customLight"
            />
            {errors.description !== undefined && (
              <span className="text-red-500">
                {errors.description?.message}
              </span>
            )}

            <Button type="submit" mt={4}>
              Guardar
            </Button>
          </form>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
}
