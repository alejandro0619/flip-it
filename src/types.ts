export interface RoomMember {
  user_id: string;
  full_name?: string;
  email?: string;
}

export interface Room {
  room_name: string;
  room_description: string;
  room_members: RoomMember[];
  id: string,
  owner: RoomMember
}
