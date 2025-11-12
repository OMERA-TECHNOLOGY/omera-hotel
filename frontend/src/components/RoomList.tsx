import React from "react";
import type { Room } from "@/types/rooms";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Eye, Edit, Trash2, Crown, MapPin, Star } from "lucide-react";

interface Props {
  rooms: Room[];
  onView: (room: Room) => void;
  onEdit: (room: Room) => void;
  onDelete: (room: Room) => void;
}

export default function RoomList({ rooms, onView, onEdit, onDelete }: Props) {
  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {rooms.map((room) => (
        <Card key={room.id} className="group">
          <div className="absolute top-4 left-4">
            <Badge variant="outline">{room.room_type?.name ?? "—"}</Badge>
          </div>
          <CardHeader className="pt-8">
            <CardTitle>Room {room.room_number}</CardTitle>
            <CardDescription>
              <MapPin className="inline-block mr-1" /> Floor {room.floor ?? "—"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold">
                  {Intl.NumberFormat("en-ET").format(room.base_price_birr)} ETB
                </div>
                <div className="text-xs text-muted-foreground">per night</div>
              </div>
              <div className="flex items-center gap-2">
                <Star className="h-4 w-4 text-amber-500" /> <span>{"4.5"}</span>
              </div>
            </div>

            <div className="mt-4 grid grid-cols-3 gap-2">
              <Button variant="outline" size="sm" onClick={() => onView(room)}>
                <Eye className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="sm" onClick={() => onEdit(room)}>
                <Edit className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => onDelete(room)}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
