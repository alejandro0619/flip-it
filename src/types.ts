export interface RoomMember {
  user_id: string;
  full_name?: string;
  email?: string;
  permissions?: "READ" | "ADMIN" | "EDIT",
}

export interface Room {
  room_name: string;
  room_description: string;
  room_members: RoomMember[];
  id: string,
  owner: RoomMember,
  is_public: boolean;
}

export type ProfileDetails = {
  full_name: string;
  email: string;
  id: string;
  number_of_rooms: number;
  created_at: string;
  description: string;
};

export type ServerRes<T> = {
  message: string;
  payload?: T;
  error?: {
    code: string;
    err_message: string;
  };
};
