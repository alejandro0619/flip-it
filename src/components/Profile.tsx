import { getUser } from "@/actions/user";
import { ProfileDetails } from "@/types";
import { format } from "date-fns";
import {
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Spinner,
  Button,
  Input,
  Textarea,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { FaEnvelope, FaCalendarAlt, FaUsers } from "react-icons/fa";
import Avatar from "./Avatar";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { userProfileSchema } from "@/schemas/profile"; // Importa el esquema de validación

export function UserProfile({
  userId,
  isProfileOpen,
  onProfileClose,
  isModifiable = false,
}: {
  userId: string;
  isProfileOpen: boolean;
  onProfileClose: () => void;
  isModifiable: boolean;
}) {
  const [user, setUser] = useState<ProfileDetails | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm({
    resolver: zodResolver(userProfileSchema),
    defaultValues: {
      full_name: "",
      email: "",
      description: "",
    },
  });

  useEffect(() => {
    if (userId) {
      getUser({ id: userId }).then((data) => {
        if (data.payload) {
          setUser(data.payload);
          setValue("full_name", data.payload.full_name);
          setValue("email", data.payload.email);
          setValue("description", data.payload.description || "");
        }
      });
    }
  }, [userId, setValue]);

  const formattedDate = user
    ? format(new Date(user.created_at), "MM-dd-yyyy")
    : "";

  const onSubmit = (data: any) => {
    console.log("Formulario enviado con los datos:", data);
    // Aquí podrías hacer una llamada a la API para guardar los cambios
    onProfileClose();
  };

  return (
    <Modal isOpen={isProfileOpen} onClose={onProfileClose} isCentered>
      <ModalContent className="w-full max-w-lg">
        <ModalHeader className="text-center text-2xl font-bold">
          Perfil
        </ModalHeader>
        <ModalCloseButton />
        <ModalBody className="flex flex-col items-center py-6">
          {user ? (
            <form
              onSubmit={handleSubmit(onSubmit)}
              className="w-full flex flex-col items-center gap-2"
            >
              <Avatar
                placeholder={user.full_name}
                style={"character"}
                size={100}
              />
              {isModifiable ? (
                <>
                  <Input
                    className="text-2xl font-semibold mb-2"
                    {...register("full_name")}
                    isInvalid={!!errors.full_name}
                    placeholder="Nombre completo"
                  />
                  <Input
                    {...register("email")}
                    isInvalid={!!errors.email}
                    placeholder="Correo electrónico"
                    className="text-gray-600"
                  />
                  <Textarea
                    {...register("description")}
                    placeholder="Descripción"
                    className="text-gray-600 mt-4"
                  />
                </>
              ) : (
                <>
                  <h2 className="text-2xl font-semibold mb-2">
                    {user.full_name}
                  </h2>
                  <div className="flex items-center gap-1">
                    <FaEnvelope className="text-custom-darkenedLighter" />
                    <p className="text-gray-600">{user.email}</p>
                  </div>
                  <p className="text-gray-600 text-center mt-4">
                    {user.description}
                  </p>
                </>
              )}
              <div className="flex items-center gap-1">
                <FaCalendarAlt className="text-custom-darkenedLighter" />
                <p className="text-gray-600">Miembro desde {formattedDate}</p>
              </div>
              <div className="flex items-center gap-1">
                <FaUsers className="text-custom-darkenedLighter" />
                <p className="text-gray-600">
                  Forma parte de {user.number_of_rooms} salas
                </p>
              </div>
            </form>
          ) : (
            <div className="flex justify-center items-center h-40">
              <Spinner size="xl" />
            </div>
          )}
        </ModalBody>
        <ModalFooter className="flex justify-center">
          {isModifiable ? (
            <Button
              colorScheme="blue"
              type="submit"
              onClick={handleSubmit(onSubmit)}
            >
              Guardar cambios
            </Button>
          ) : (
            <Button colorScheme="blue" onClick={onProfileClose}>
              Cerrar
            </Button>
          )}
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
