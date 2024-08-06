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
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { FaEnvelope, FaCalendarAlt, FaUsers } from "react-icons/fa";
import Avatar from "./Avatar";

export function UserProfile({
  userId,
  isProfileOpen,
  onProfileClose,
}: {
  userId: string;
  isProfileOpen: boolean;
  onProfileClose: () => void;
}) {
  const [user, setUser] = useState<ProfileDetails | null>(null);

  useEffect(() => {
    if (userId) {
      getUser({ id: userId }).then((data) => {
        setUser(data.payload ?? null);
      });
    }
  }, [userId]);

  const formattedDate = user ? format(new Date(user.created_at), "MM-dd-yyyy") : "";

  return (
    <Modal isOpen={isProfileOpen} onClose={onProfileClose} isCentered>
      <ModalContent className="w-full max-w-lg">
        <ModalHeader className="text-center text-2xl font-bold">
          Perfil
        </ModalHeader>
        <ModalCloseButton />
        <ModalBody className="flex flex-col items-center py-6">
          {user ? (
            <div className="flex flex-col items-center gap-2">
              <Avatar
                placeholder={user.full_name}
                style={"character"}
                size={100}
              />
              <h2 className="text-2xl font-semibold mb-2">{user.full_name}</h2>
              <div className="flex items-center gap-1">
                <FaEnvelope className="text-custom-darkenedLighter" />
                <p className="text-gray-600">{user.email}</p>
              </div>
              <div className="flex items-center gap-1">
                <FaCalendarAlt className="text-custom-darkenedLighter" />
                <p className="text-gray-600">Miembro desde {formattedDate}</p>
              </div>
              <div className="flex items-center gap-1">
                <FaUsers className="text-custom-darkenedLighter" />
                <p className="text-gray-600">Forma parte de {user.number_of_rooms} salas</p>
              </div>
              <p className="text-gray-600 text-center mt-4">{user.description}</p>
            </div>
          ) : (
            <div className="flex justify-center items-center h-40">
              <Spinner size="xl" />
            </div>
          )}
        </ModalBody>
        <ModalFooter className="flex justify-center">
          <Button colorScheme="blue" onClick={onProfileClose}>
            Cerrar
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
