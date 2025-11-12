export type RoomStatus = "vacant" | "occupied" | "cleaning" | "maintenance";

export interface RoomType {
  id: string;
  name: string;
  slug?: string;
  description?: string | null;
}

export interface Room {
  id: string;
  room_number: string;
  room_type_id?: string | null;
  room_type?: RoomType | null;
  floor?: number | null;
  capacity?: number | null;
  base_price_birr: number;
  status: RoomStatus;
  description?: string | null;
  images?: string[];
  view_type?: string | null;
  created_at?: string;
  updated_at?: string;
}

export interface CreateRoomInput {
  room_number: string;
  room_type_id?: string;
  floor?: number;
  capacity?: number;
  base_price_birr: number;
  status?: RoomStatus;
  description?: string;
  images?: string[];
  view_type?: string;
}

export type UpdateRoomInput = Partial<CreateRoomInput>;
