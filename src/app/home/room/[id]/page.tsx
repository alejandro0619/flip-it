"use client";
import { useEffect, useRef, useState } from "react";
import { getRoomById } from "@/actions/rooms";
import { Room } from "@/types";
import {
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Button,
  useDisclosure,
  Drawer,
  DrawerBody,
  DrawerCloseButton,
  DrawerContent,
  DrawerHeader,
  DrawerOverlay,
} from "@chakra-ui/react";
import Avatar from "@/components/Avatar";
import { FaCrown } from "react-icons/fa6";
import { User } from "@supabase/supabase-js";
import { createClient } from "@/utils/supabase/client";
import LoadingScreen from "@/components/LoadingScreen";

export default function RoomDetails({ params }: { params: { id: string } }) {
  const [room, setRoom] = useState<Room | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const {
    isOpen: isMemberListOpen,
    onOpen: onMemberListOpen,
    onClose: onMemberListClose,
  } = useDisclosure();
  const memberListBtn = useRef(null);

  useEffect(() => {
    (async () => {
      const supabase = createClient();
      const { data, error } = await supabase.auth.getUser();
      if (!error) {
        setCurrentUser(data.user);
      }
      const room = await getRoomById(params.id);
      setRoom(room);
      setIsLoading(false);
    })();
  }, [params]);

  return (
    <div className="mt-4 mx-2 p-4 bg-white shadow-lg rounded-lg">
      <LoadingScreen isLoading={isLoading} />
      <Drawer
        isOpen={isMemberListOpen}
        placement="right"
        onClose={onMemberListClose}
        finalFocusRef={memberListBtn}
      >
        <DrawerOverlay />
        <DrawerContent className="bg-pinkLavender">
          <DrawerCloseButton />
          <DrawerHeader className="text-2xl font-bold border-b border-darkPurple">
            Usuarios en la sala
          </DrawerHeader>
          <DrawerBody>
            {room?.room_members.map((member) => (
              <div
                key={member.user_id}
                className="flex items-center p-3 mb-2 bg-white rounded-lg shadow hover:bg-wisteria transition duration-200 ease-in-out border border-gray-200 w-full"
              >
                <div className="flex-shrink-0">
                  <Avatar
                    placeholder={member.full_name as string}
                    size={50}
                    style="character"
                  />
                </div>
                <div className="ml-4 flex flex-col min-w-0 gap-2">
                  <h3 className="text-lg font-semibold text-darkPurple flex gap-2 items-center">
                    {member.full_name}{" "}
                    {room?.owner.user_id === member.user_id && (
                      <FaCrown size={20} className="text-skyMagenta" />
                    )}
                  </h3>
                  <p className="text-sm text-gray-500 truncate">
                    {member.email}
                  </p>
                  <Menu>
                    <MenuButton className="bg-skyMagenta hover:bg-white text-white hover:text-skyMagenta font-bold py-2 px-4 rounded">
                      Acciones
                    </MenuButton>
                    <MenuList>
                      {room?.owner.user_id !== member.user_id &&
                        room?.owner.user_id === currentUser?.id && (
                          <MenuItem>Eliminar de la sala</MenuItem>
                        )}
                      <MenuItem>Ver perfil</MenuItem>
                    </MenuList>
                  </Menu>
                </div>
              </div>
            ))}
          </DrawerBody>
        </DrawerContent>
      </Drawer>
      <div className="mb-4">
        <h1 className="text-3xl font-bold text-eminence">
          Nombre de la sala: {room?.room_name}
        </h1>
        <h2 className="text-lg text-darkPurple mt-2">
          Descripción: {room?.room_description}
        </h2>
      </div>
      <Button
        ref={memberListBtn}
        onClick={onMemberListOpen}
        className="bg-skyMagenta hover:bg-wisteria text-white font-bold py-2 px-4 rounded"
      >
        Miembros de la sala
      </Button>
    </div>
  );
}
