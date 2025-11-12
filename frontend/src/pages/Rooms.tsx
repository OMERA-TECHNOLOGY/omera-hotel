import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { extractError } from "@/lib/api";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Plus,
  Filter,
  Zap,
  Crown,
  Sparkles,
  MapPin,
  Star,
  Wifi,
  Tv,
  Wind,
  Martini,
  Home,
  Edit,
  Trash2,
  Eye,
} from "lucide-react";
import { useLanguage } from "@/contexts/language-context";
import RoomList from "@/components/RoomList";
import RoomForm from "@/components/RoomForm";
import {
  useRooms,
  useCreateRoom,
  useUpdateRoom,
  useDeleteRoom,
} from "@/lib/hooks/useRooms";
import { useToast } from "@/hooks/use-toast";
/* eslint-disable @typescript-eslint/no-explicit-any */
/*
Integration plan & implementation instructions (Rooms page)

Overview
---
The following block is a complete, actionable plan and per-file/component implementation instructions
for integrating the Rooms page with the Supabase-backed API (tables: `rooms`, `room_types`).
Paste code snippets into the suggested files, then wire the hooks/components into `Rooms.tsx`.

1) API endpoints (server-side)
---
Paths (REST-style). Adjust if your backend routes differ, but these match the common patterns used by
the current `backend/src` structure:

GET /rooms?limit=20&offset=0&status=vacant&room_type_id=<id>
  - Purpose: list rooms with optional filters & pagination
  - Query params: limit, offset, status, room_type_id, search
  - Response 200: { data: { rooms: Room[], total: number } }

GET /rooms/:id
  - Purpose: get a single room with optional expansion of room_type
  - Response 200: { data: { room: Room & { room_type?: RoomType } } }

POST /rooms
  - Purpose: create a room
  - Body: CreateRoomInput (JSON)
  - Response 201: { data: { room: Room } }

PUT /rooms/:id
  - Purpose: update a room
  - Body: UpdateRoomInput (JSON)
  - Response 200: { data: { room: Room } }

DELETE /rooms/:id
  - Purpose: delete a room
  - Response 204: { }

Standard error: 4xx/5xx with JSON { error: { message: string, code?: string, details?: any } }

DB relevant fields (from database.sql)
---
- rooms: id (uuid), room_number, room_type_id (fk), floor, capacity, base_price_birr, status (enum), description, images (json[]), view_type, created_at, updated_at
- room_types: id, name, slug, description

2) TypeScript types (create file: `frontend/src/types/rooms.ts`)
---
Example (copy into file):

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
  room_type?: RoomType | null; // when expanded
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

3) React Query hooks (create file: `frontend/src/lib/hooks/useRooms.ts`)
---
Use React Query for caching, background refresh and invalidation. Example implementations:

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiGet, apiPost, apiPut, apiDelete } from "@/lib/api";
import type { Room, CreateRoomInput, UpdateRoomInput } from "@/types/rooms";

export const ROOM_KEYS = { all: ["rooms"], lists: (filters: any) => ["rooms", "list", JSON.stringify(filters)], detail: (id: string) => ["rooms", "detail", id] };

export function useRooms(filters = { limit: 50, offset: 0 }) {
  return useQuery(ROOM_KEYS.lists(filters), async () => {
    const res = await apiGet(`/rooms?limit=${filters.limit}&offset=${filters.offset}`);
    // backend returns { data: { rooms, total } }
    return res.data?.rooms || res.rooms || [];
  }, { keepPreviousData: true });
}

export function useRoom(id?: string) {
  return useQuery(ROOM_KEYS.detail(String(id)), async () => {
    if (!id) return null;
    const res = await apiGet(`/rooms/${id}`);
    return res.data?.room || res.room || res;
  }, { enabled: !!id });
}

export function useCreateRoom() {
  const qc = useQueryClient();
  return useMutation((body: CreateRoomInput) => apiPost(`/rooms`, body), {
    onSuccess: () => qc.invalidateQueries({ queryKey: ROOM_KEYS.all }),
  });
}

export function useUpdateRoom() {
  const qc = useQueryClient();
  return useMutation(({ id, body }: { id: string; body: UpdateRoomInput }) => apiPut(`/rooms/${id}`, body), {
    onSuccess: (_data, { id }) => {
      qc.invalidateQueries({ queryKey: ROOM_KEYS.all });
      qc.invalidateQueries({ queryKey: ROOM_KEYS.detail(id) });
    },
  });
}

export function useDeleteRoom() {
  const qc = useQueryClient();
  return useMutation((id: string) => apiDelete(`/rooms/${id}`), {
    onMutate: async (id: string) => {
      await qc.cancelQueries({ queryKey: ROOM_KEYS.all });
      const previous = qc.getQueryData(ROOM_KEYS.all as any);
      qc.setQueryData(ROOM_KEYS.all as any, (old: any) => (old || []).filter((r: any) => r.id !== id));
      return { previous };
    },
    onError: (_err, _id, context: any) => qc.setQueryData(ROOM_KEYS.all as any, context.previous),
    onSettled: () => qc.invalidateQueries({ queryKey: ROOM_KEYS.all }),
  });
}

4) UI components - per-file plan and snippets
---
- `frontend/src/components/RoomList.tsx` — present list/grid of rooms (call `useRooms`), filters, pagination, and action callbacks for view/edit/delete.
- `frontend/src/components/RoomDetails.tsx` — dialog or page showing full room metadata (expand room_type, images, description).
- `frontend/src/components/RoomForm.tsx` — create/edit form wired to `react-hook-form` + `zod` (or `yup`), used for both create and update.

RoomForm (example snippet)
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

const roomSchema = z.object({
  room_number: z.string().min(1, "Room number is required"),
  room_type_id: z.string().optional(),
  floor: z.number().min(0).optional(),
  capacity: z.number().min(1).optional(),
  base_price_birr: z.number().min(0, "Price required"),
  status: z.enum(["vacant","occupied","cleaning","maintenance"]).optional(),
  description: z.string().optional(),
});

// useForm({ resolver: zodResolver(roomSchema), defaultValues: {} })

Use `isSubmitting` to disable submit button and show spinner.

5) Wiring to pages/Rooms.tsx (this file)
---
Replace manual api calls and local mutations with the hooks above. Example usages:

const { data: rooms, isLoading } = useRooms({ limit: 50, offset: 0 });
const createRoom = useCreateRoom();
const updateRoom = useUpdateRoom();
const deleteRoom = useDeleteRoom();

Create flow (in RoomForm onSubmit):
await createRoom.mutateAsync(values);
toast({ title: 'Room created', description: `Room ${values.room_number} created.`, variant: 'success' });

Update flow:
await updateRoom.mutateAsync({ id, body: values });
toast({ title: 'Room updated', description: `Room ${values.room_number} updated.`, variant: 'success' });

Delete flow (confirmation dialog):
open confirmation Dialog -> onConfirm -> await deleteRoom.mutateAsync(id)
on success -> toast success, on error -> toast error

6) Form validation, loading states, error handling
---
- Use `react-hook-form` + `zod` for schema and client-side validation. Show server errors by catching mutate errors and mapping using `extractError` from `@/lib/api`.
- Loading states: use `isLoading` (initial), `isFetching` (background), `isSubmitting` (form). Disable inputs when submitting.
- Errors: show field errors under inputs (react-hook-form), show top-level server errors as an alert or toast.

7) Toasts and confirmation dialogs
---
- Use your existing toast system (file likely in `src/components/ui/toast` or `use-toast` hook). Example pattern:
  toast({ title: 'Success', description: 'Room saved', variant: 'success' });
- Confirmation dialog: reuse `Dialog` component imported above or a simple `confirm()` fallback. Prefer modal with explicit Confirm/Cancel.

8) Field mapping & UI transformations
---
- base_price_birr -> display formatted price: `Intl.NumberFormat('en-ET').format(price)` and append `ETB`.
- status enum -> badge/color mapping (already in file). Keep mapping consistent with backend enumerated values.
- room_type -> show `room.room_type?.name ?? typeNameFromId(room.room_type_id)`; fetch `room_types` list for filter dropdowns.
- images: if stored as array of URLs, show a carousel or first image as thumbnail.

9) Per-component TODO checklist (practical order)
---
1. Create `src/types/rooms.ts` with the types above.
2. Create `src/lib/hooks/useRooms.ts` with the react-query hooks above.
3. Create `src/components/RoomForm.tsx` (react-hook-form + zod) using `useCreateRoom`/`useUpdateRoom` via props.
4. Create `src/components/RoomList.tsx` to render grid and receive `rooms`, `onEdit`, `onDelete`, `onView` callbacks.
5. Update this `Rooms.tsx` page to import and use the hooks and components above. Remove inline api calls and `confirm` fallbacks.
6. Add toast success/error usage across create/update/delete flows.

10) Testing & verification
---
- Run frontend: `pnpm dev` or `npm run dev` (check `frontend/package.json`).
- Test flows in browser: load Rooms page, create room, edit room, delete room. Verify list updates and toasts appear.
- If backend is protected by auth, ensure your `api` helpers attach auth token (check `@/lib/api.ts`).

Notes & assumptions
---
- I assumed REST endpoints as above. If your backend uses a slightly different route or response shape, adapt the `apiGet/apiPost/apiPut/apiDelete` calls or the react-query hooks. Use `res.data` when backend wraps payload.
- The plan favors small reusable components and keeps `Rooms.tsx` as the orchestration layer (calls hooks and renders composed components).

If you want, I can now:
- create the TS types file and hooks under `src/lib/hooks` and create `RoomForm.tsx` and `RoomList.tsx` components and wire them into this page.
- or, if you prefer, I can only modify this file to use the new hooks (if you already want to implement hooks yourself).

End of integration plan.
*/
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";

type RoomStatus = "vacant" | "occupied" | "cleaning" | "maintenance";

interface RoomApi {
  id: string;
  room_number: string;
  room_type_id?: string;
  floor: number;
  status: RoomStatus;
  base_price_birr: number;
  view_type?: string;
}
interface RoomUI {
  id: string;
  number: string;
  type: string;
  floor: number;
  status: RoomStatus;
  price: number;
  features: string[];
  rating: number;
  size: string;
  view: string;
}

const Rooms = () => {
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [filterType, setFilterType] = useState<string>("all");
  const { t } = useLanguage();

  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [editingRoom, setEditingRoom] = useState<any | null>(null);
  const [viewingRoom, setViewingRoom] = useState<any | null>(null);
  const [toDelete, setToDelete] = useState<any | null>(null);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const { toast } = useToast();
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const pageSize = 9;

  const roomsQuery = useRooms({ limit: pageSize, offset: (page - 1) * pageSize, status: "all", search });
  const createRoom = useCreateRoom();
  const updateRoom = useUpdateRoom();
  const deleteRoom = useDeleteRoom();
  const roomsData = roomsQuery.data?.rooms || [];
  const totalRooms = roomsQuery.data?.total || 0;
  const isLoading = roomsQuery.isLoading;
  const error = (roomsQuery as any).error;

  const rooms: RoomUI[] = (roomsData || []).map((r: any) => ({
    id: r.id,
    number: r.room_number || r.roomNumber || String(r.id).slice(0, 4),
    type: r.room_types?.name || r.room_type_name || r.type || "Unknown",
    floor: r.floor || 0,
    status: r.status || "vacant",
    price: Number(r.base_price_birr || r.price || 0),
    features: r.features || ["WiFi", "TV", "AC"],
    rating: r.rating || 4.5,
    size: r.size || "-",
    view: r.view_type || r.view || "-",
  }));

  const getStatusColor = (status: RoomStatus) => {
    switch (status) {
      case "vacant":
        return "bg-emerald-500";
      case "occupied":
        return "bg-amber-500";
      case "cleaning":
        return "bg-orange-500";
      case "maintenance":
        return "bg-red-500";
      default:
        return "bg-slate-500";
    }
  };

  const getStatusGradient = (status: RoomStatus) => {
    switch (status) {
      case "vacant":
        return "from-emerald-500 to-green-500";
      case "occupied":
        return "from-amber-500 to-yellow-500";
      case "cleaning":
        return "from-orange-500 to-amber-500";
      case "maintenance":
        return "from-red-500 to-orange-500";
      default:
        return "from-slate-500 to-slate-600";
    }
  };

  const getStatusLabel = (status: RoomStatus) => {
    return status.charAt(0).toUpperCase() + status.slice(1);
  };

  const getFeatureIcon = (feature: string) => {
    switch (feature) {
      case "WiFi":
        return Wifi;
      case "TV":
        return Tv;
      case "AC":
        return Wind;
      case "Mini Bar":
        return Martini;
      case "Balcony":
        return Home;
      case "Jacuzzi":
        return Sparkles;
      case "Butler":
        return Crown;
      case "Ocean View":
        return MapPin;
      default:
        return Star;
    }
  };

  const filteredRooms = rooms.filter((room) => {
    if (filterStatus !== "all" && room.status !== filterStatus) return false;
    if (filterType !== "all" && room.type !== filterType) return false;
    return true;
  });

  const statusCounts = {
    vacant: rooms.filter((r) => r.status === "vacant").length,
    occupied: rooms.filter((r) => r.status === "occupied").length,
    cleaning: rooms.filter((r) => r.status === "cleaning").length,
    maintenance: rooms.filter((r) => r.status === "maintenance").length,
  };

  const handleDeleteRoom = async (roomId: string) => {
    // open confirmation dialog
    const r = rooms.find((r) => r.id === roomId);
    setToDelete(r || { id: roomId });
    setConfirmOpen(true);
  };

  const confirmDelete = async () => {
    if (!toDelete) return setConfirmOpen(false);
    try {
      await deleteRoom.mutateAsync(toDelete.id);
      toast({ title: "Room deleted", description: `Room ${toDelete.room_number || toDelete.number || ''} removed`, variant: "success" });
    } catch (e) {
      toast({ title: "Delete failed", description: extractError(e), variant: "destructive" });
    } finally {
      setConfirmOpen(false);
      setToDelete(null);
    }
  };

  const handleEditRoom = (roomIdOrRoom: any) => {
    // Accept either id or room object
    const roomObj =
      typeof roomIdOrRoom === "string"
        ? rooms.find((r) => r.id === roomIdOrRoom)
        : roomIdOrRoom;
    setEditingRoom(roomObj || null);
    setIsCreateOpen(true);
  };

  const handleViewDetails = (room: RoomUI) => {
    setViewingRoom(room);
  };

  if (isLoading) return <div className="p-6">Loading rooms...</div>;
  if (error) return <div className="p-6 text-red-600">{String(error)}</div>;
  return (
    <div className="space-y-8 p-6">
      {/* Enhanced Header Section */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-slate-900 via-emerald-900 to-amber-900 p-8 text-white">
        <div className="relative z-10">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-white to-emerald-200 bg-clip-text text-transparent">
                {t.roomManagement}
              </h1>
              <p className="mt-2 text-emerald-200 text-lg">
                Premium Room Inventory & Status Management
              </p>
            </div>
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-3 bg-white/10 backdrop-blur-sm rounded-2xl p-4 border border-white/20">
                <div className="p-2 bg-emerald-400/20 rounded-xl">
                  <Home className="h-6 w-6 text-emerald-400" />
                </div>
                <div>
                  <p className="text-sm font-semibold">Room Analytics</p>
                  <p className="text-xs text-emerald-200">60 total rooms</p>
                </div>
              </div>
              <Button
                onClick={() => {
                  setIsCreateOpen(true);
                  setEditingRoom(null);
                }}
                className="bg-gradient-to-r from-emerald-500 to-amber-500 hover:from-emerald-600 hover:to-amber-600 border-0 shadow-2xl"
              >
                <Plus className="h-5 w-5 mr-2" />
                {t.addRoom}
              </Button>
            </div>
          </div>
        </div>

        {/* Background Elements */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-emerald-400/20 to-amber-500/20 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-gradient-to-tr from-amber-400/20 to-emerald-400/20 rounded-full blur-3xl"></div>
      </div>

      {/* Enhanced Status Overview */}
      <div className="grid gap-6 md:grid-cols-4">
        <Card className="relative overflow-hidden border-0 bg-gradient-to-br from-white to-emerald-50 dark:from-slate-800 dark:to-emerald-900/20 shadow-xl group">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium text-slate-600 dark:text-slate-300">
                {t.vacant}
              </CardTitle>
              <div className="p-2 bg-emerald-500/10 rounded-xl">
                <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-emerald-600 dark:text-emerald-400">
              {statusCounts.vacant}
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Ready for check-in
            </p>
          </CardContent>
          <div className="absolute bottom-0 left-0 w-full h-1 bg-slate-200 dark:bg-slate-700">
            <div
              className="h-full bg-gradient-to-r from-emerald-500 to-green-500 transition-all duration-1000"
              style={{
                width: `${(statusCounts.vacant / rooms.length) * 100}%`,
              }}
            ></div>
          </div>
        </Card>

        <Card className="relative overflow-hidden border-0 bg-gradient-to-br from-white to-amber-50 dark:from-slate-800 dark:to-amber-900/20 shadow-xl group">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium text-slate-600 dark:text-slate-300">
                {t.occupied}
              </CardTitle>
              <div className="p-2 bg-amber-500/10 rounded-xl">
                <div className="w-2 h-2 bg-amber-500 rounded-full"></div>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-amber-600 dark:text-amber-400">
              {statusCounts.occupied}
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Currently occupied
            </p>
          </CardContent>
          <div className="absolute bottom-0 left-0 w-full h-1 bg-slate-200 dark:bg-slate-700">
            <div
              className="h-full bg-gradient-to-r from-amber-500 to-yellow-500 transition-all duration-1000"
              style={{
                width: `${(statusCounts.occupied / rooms.length) * 100}%`,
              }}
            ></div>
          </div>
        </Card>

        <Card className="relative overflow-hidden border-0 bg-gradient-to-br from-white to-orange-50 dark:from-slate-800 dark:to-orange-900/20 shadow-xl group">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium text-slate-600 dark:text-slate-300">
                {t.cleaning}
              </CardTitle>
              <div className="p-2 bg-orange-500/10 rounded-xl">
                <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-orange-600 dark:text-orange-400">
              {statusCounts.cleaning}
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Being prepared
            </p>
          </CardContent>
          <div className="absolute bottom-0 left-0 w-full h-1 bg-slate-200 dark:bg-slate-700">
            <div
              className="h-full bg-gradient-to-r from-orange-500 to-amber-500 transition-all duration-1000"
              style={{
                width: `${(statusCounts.cleaning / rooms.length) * 100}%`,
              }}
            ></div>
          </div>
        </Card>

        <Card className="relative overflow-hidden border-0 bg-gradient-to-br from-white to-red-50 dark:from-slate-800 dark:to-red-900/20 shadow-xl group">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium text-slate-600 dark:text-slate-300">
                {t.maintenance}
              </CardTitle>
              <div className="p-2 bg-red-500/10 rounded-xl">
                <div className="w-2 h-2 bg-red-500 rounded-full"></div>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-red-600 dark:text-red-400">
              {statusCounts.maintenance}
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Under maintenance
            </p>
          </CardContent>
          <div className="absolute bottom-0 left-0 w-full h-1 bg-slate-200 dark:bg-slate-700">
            <div
              className="h-full bg-gradient-to-r from-red-500 to-orange-500 transition-all duration-1000"
              style={{
                width: `${(statusCounts.maintenance / rooms.length) * 100}%`,
              }}
            ></div>
          </div>
        </Card>
      </div>

      {/* Enhanced Filters */}
      <div className="flex items-center gap-4 p-6 bg-gradient-to-r from-slate-50 to-white dark:from-slate-800 dark:to-slate-900 rounded-2xl shadow-xl border-0">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-emerald-500/10 rounded-xl">
            <Filter className="h-5 w-5 text-emerald-500" />
          </div>
          <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">
            Advanced Filters:
          </span>
        </div>
        <Select value={filterStatus} onValueChange={setFilterStatus}>
          <SelectTrigger className="w-[200px] bg-white/80 dark:bg-slate-700/80 backdrop-blur-sm border-slate-200 dark:border-slate-600 rounded-xl">
            <SelectValue placeholder="All Statuses" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Statuses</SelectItem>
            <SelectItem value="vacant">Vacant</SelectItem>
            <SelectItem value="occupied">Occupied</SelectItem>
            <SelectItem value="cleaning">Cleaning</SelectItem>
            <SelectItem value="maintenance">Maintenance</SelectItem>
          </SelectContent>
        </Select>
        <Select value={filterType} onValueChange={setFilterType}>
          <SelectTrigger className="w-[200px] bg-white/80 dark:bg-slate-700/80 backdrop-blur-sm border-slate-200 dark:border-slate-600 rounded-xl">
            <SelectValue placeholder="All Types" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Types</SelectItem>
            <SelectItem value="Single">Single Room</SelectItem>
            <SelectItem value="Deluxe">Deluxe Room</SelectItem>
            <SelectItem value="Executive Suite">Executive Suite</SelectItem>
            <SelectItem value="Presidential">Presidential Suite</SelectItem>
          </SelectContent>
        </Select>
        <div className="ml-4 w-[320px]">
          <Input
            placeholder="Search room number..."
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            className="rounded-xl bg-white/80 dark:bg-slate-700/80"
          />
        </div>
        <Button
          variant="outline"
          className="ml-auto border-slate-300 dark:border-slate-600 bg-white/80 dark:bg-slate-700/80 backdrop-blur-sm rounded-xl"
        >
          <Zap className="h-4 w-4 mr-2" />
          Quick Actions
        </Button>
      </div>

      {/* Enhanced Room Grid */}
      <RoomList
        rooms={filteredRooms as any}
        onView={(r) => handleViewDetails(r as any)}
        onEdit={(r) => handleEditRoom(r as any)}
        onDelete={(r) => handleDeleteRoom((r as any).id)}
      />

      {/* Pagination */}
      <div className="flex items-center justify-between mt-6">
        <div className="text-sm text-slate-500">Showing {rooms.length} of {totalRooms} rooms</div>
        <div className="flex items-center gap-2">
          <Button disabled={page <= 1} onClick={() => setPage((p) => Math.max(1, p - 1))}>Previous</Button>
          <div className="px-3">Page {page}</div>
          <Button disabled={(page * pageSize) >= totalRooms} onClick={() => setPage((p) => p + 1)}>Next</Button>
        </div>
      </div>

      {/* Create / Edit modal */}
      <Dialog open={isCreateOpen} onOpenChange={(v) => setIsCreateOpen(v)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {editingRoom ? "Edit Room" : "Create Room"}
            </DialogTitle>
            <DialogDescription>
              {editingRoom ? "Edit room details" : "Fill in new room"}
            </DialogDescription>
          </DialogHeader>
          <RoomForm
            initialValues={editingRoom}
            onCancel={() => setIsCreateOpen(false)}
            onSubmit={async (values) => {
              try {
                if (editingRoom) {
                  await updateRoom.mutateAsync({ id: editingRoom.id, body: values });
                  toast({ title: "Room updated", description: `Room ${values.room_number} updated`, variant: "success" });
                } else {
                  await createRoom.mutateAsync(values as any);
                  toast({ title: "Room created", description: `Room ${values.room_number} created`, variant: "success" });
                }
                setIsCreateOpen(false);
              } catch (e) {
                toast({ title: "Save failed", description: extractError(e), variant: "destructive" });
              }
            }}
          />
        </DialogContent>
      </Dialog>

      {/* Delete confirmation dialog */}
      <Dialog open={confirmOpen} onOpenChange={setConfirmOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm delete</DialogTitle>
            <DialogDescription>Are you sure you want to delete this room? This action cannot be undone.</DialogDescription>
          </DialogHeader>
          <div className="flex justify-end gap-2">
            <Button variant="ghost" onClick={() => setConfirmOpen(false)}>Cancel</Button>
            <Button variant="destructive" onClick={() => confirmDelete()}>Delete</Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* View dialog */}
      <Dialog open={!!viewingRoom} onOpenChange={() => setViewingRoom(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Room details</DialogTitle>
            <DialogDescription>Full room information</DialogDescription>
          </DialogHeader>
          <div className="space-y-2">
            <pre className="whitespace-pre-wrap">
              {JSON.stringify(viewingRoom, null, 2)}
            </pre>
            <div className="flex justify-end">
              <Button onClick={() => setViewingRoom(null)}>Close</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Rooms;
