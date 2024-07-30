"use client";
import { useEffect, useRef, useState } from "react";
import { getRoomById } from "@/actions/rooms";
import { Room } from "@/types";
import { Modal, Button, useDisclosure, Drawer, DrawerBody, DrawerCloseButton, DrawerContent, DrawerHeader, DrawerOverlay } from "@chakra-ui/react";
export default function RoomDetails({ params }: { params: { id: string } }) {
  const [room, setRoom] = useState<Room | null>(null);
  const {
    isOpen: isMemberListOpen,
    onOpen: onMemberListOpen,
    onClose: onMemberListClose,
  } = useDisclosure();
  const memberListBtn = useRef(null)
  useEffect(() => {
    (async () => {
      const room = await getRoomById(params.id);
      setRoom(room);
    })();
  }, [params]);
  return (
    <div className="mt-4 mx-2">
      <Drawer
        isOpen={isMemberListOpen}
        placement="right"
        onClose={onMemberListClose}
        finalFocusRef={memberListBtn}

      >
        <DrawerOverlay />
        <DrawerContent>
          <DrawerCloseButton />
          <DrawerHeader>Usuarios en la sala</DrawerHeader>
          <DrawerBody>
            {room?.room_members.map((member) => (
              <div key={member.user_id}>
                <h3>{member.full_name}</h3>
              </div>
            ))}
          </DrawerBody>
        </DrawerContent>
      </Drawer>
      <h1 className="text-2xl">Nombre de la sala: {room?.room_name} </h1>
      <h2 className="text-lg">Descripción: {room?.room_description}</h2>
      <Button ref={memberListBtn} onClick={onMemberListOpen}>Miembros de la sala</Button>
    </div>
  );
}
