"use client";
import { useEffect, useRef, useState } from "react";
import { getRoomById } from "@/actions/rooms";
import { Room } from "@/types";
import { Button } from "@chakra-ui/react";

import { User } from "@supabase/supabase-js";
import { createClient } from "@/utils/supabase/client";
import LoadingScreen from "@/components/LoadingScreen";
import MembersList from "@/components/MembersList";
import { useRouter } from "next/navigation";

export default function RoomDetails({ params }: { params: { id: string } }) {
  const [room, setRoom] = useState<Room | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const supabase = createClient();
  const router = useRouter();
  const fetchRoomAndCheckMembership = async () => {
    setIsLoading(true);

    const { data: userData, error: userError } = await supabase.auth.getUser();
    if (userError || !userData.user) {
      router.push("/auth");
      return;
    }

    setCurrentUser(userData.user);

    const room = await getRoomById(params.id);
    if (!room) {
      router.push("/home");
      return;
    }

    setRoom(room);

    const isCurrentUserMember = room.room_members.some(
      (member) => member.user_id === userData.user.id
    );
    console.log("usuario se encuentra o no", isCurrentUserMember);
    if (!isCurrentUserMember) {
      router.push("/home");
      return;
    }

    setIsLoading(false);
  };

  useEffect(() => {
    fetchRoomAndCheckMembership();

    const subscription_room_members_changes = supabase
      .channel("custom-all-channel")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "room_members" },
        async (_payload) => {
          await fetchRoomAndCheckMembership();
        }
      )
      .subscribe();

    return () => {
      subscription_room_members_changes.unsubscribe();
    };
  }, [params, supabase, router]);

  if (isLoading) return <LoadingScreen isLoading={isLoading} />;
  return (
    <div className="mt-4 mx-2 p-4 bg-white shadow-lg rounded-lg">
      <div className="mb-4">
        <h1 className="text-3xl font-bold text-eminence">
          Nombre de la sala: {room?.room_name}
        </h1>
        <h2 className="text-lg text-darkPurple mt-2">
          Descripción: {room?.room_description}
        </h2>
      </div>
      <MembersList room={room} currentUser={currentUser} />
      <Button className="ml-2">Salir de la sala</Button>
    </div>
  );
}
