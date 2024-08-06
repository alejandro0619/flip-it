import { Room } from "@/types";
import {
  Drawer,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  DrawerHeader,
  DrawerBody,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  useDisclosure,
  Button,
} from "@chakra-ui/react";
import { User } from "@supabase/supabase-js";
import { useRef, useState } from "react";
import { FaCrown } from "react-icons/fa";
import Avatar from "@/components/Avatar";
import { deleteMemberFromRoom } from "@/actions/rooms";
import { toast } from "react-toastify";
import { UserProfile } from "./Profile";


type USER_TO_VIEW_PROFILE = string;
export default function MembersList({
  room,
  currentUser,
}: {
  room: Room | null;
  currentUser: User | null;
}) {
  const {
    isOpen: isMemberListOpen,
    onOpen: onMemberListOpen,
    onClose: onMemberListClose,
  } = useDisclosure();
  const {
    isOpen: isProfileOpen,
    onOpen: onProfileOpen,
    onClose: onProfileClose,
  } = useDisclosure();
  const memberListBtn = useRef(null);

  const [user_to_view_profile, set_user_to_view_profile] =
    useState<USER_TO_VIEW_PROFILE | null>(null);

  const handleProfileOnOpen = (user_id: string) => {
    set_user_to_view_profile(user_id);
    onProfileOpen();
    onMemberListClose(); // Close the member list drawer to avoid multiple views stacked one upon the other
  };

  const handleDeleteMember = async (user_to_delete_id: string) => {
    console.log("delete member", user_to_delete_id);
    const { error } = await deleteMemberFromRoom(
      room?.id as string,
      user_to_delete_id
    );
    if (error) {
      toast.error("Error eliminando miembro de la sala");
      console.error("Error deleting member from room", error);
    } else {
      toast.success("Miembro eliminado de la sala");
    }
  };

  return (
    <>
      <Button
        ref={memberListBtn}
        onClick={onMemberListOpen}
        className="bg-skyMagenta hover:bg-wisteria text-white font-bold py-2 px-4 rounded"
      >
        Miembros de la sala
      </Button>
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
              <>
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
                            <MenuItem
                              onClick={() => handleDeleteMember(member.user_id)}
                            >
                              Eliminar de la sala
                            </MenuItem>
                          )}
                        <MenuItem
                          onClick={() => handleProfileOnOpen(member.user_id)}
                        >
                          Ver perfil
                        </MenuItem>
                      </MenuList>
                    </Menu>
                  </div>
                </div>
              </>
            ))}
          </DrawerBody>
        </DrawerContent>
      </Drawer>

      {
        user_to_view_profile && (
          <UserProfile
            userId={user_to_view_profile}
            isProfileOpen={isProfileOpen}
            onProfileClose={onProfileClose}
          />
        )
      }
    </>
  );
}
