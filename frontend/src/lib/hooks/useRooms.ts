import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiGet, apiPost, apiPut, apiDelete } from "@/lib/api";
import type { Room, CreateRoomInput, UpdateRoomInput } from "@/types/rooms";
/* eslint-disable @typescript-eslint/no-explicit-any */

export const ROOM_KEYS = {
  all: ["rooms"] as const,
  lists: (filters: any) => ["rooms", "list", JSON.stringify(filters)] as const,
  detail: (id: string) => ["rooms", "detail", id] as const,
};

export function useRooms(
  filters: {
    limit?: number;
    offset?: number;
    status?: string;
    search?: string;
    room_type_id?: string;
  } = { limit: 100, offset: 0, status: "all" }
) {
  return useQuery({
    queryKey: ROOM_KEYS.lists(filters),
    queryFn: async () => {
      const params = new URLSearchParams();
      params.set("limit", String(filters.limit ?? 100));
      params.set("offset", String(filters.offset ?? 0));
      if (typeof filters.status !== "undefined")
        params.set("status", String(filters.status));
      if (filters.search) params.set("search", String(filters.search));
      if (filters.room_type_id)
        params.set("room_type_id", String(filters.room_type_id));
      const q = `?${params.toString()}`;
      const res: any = await apiGet(`/rooms${q}`);
      // backend returns { success: true, data: { rooms, total } }
      const rooms = res?.data?.rooms || res.rooms || res;
      const total =
        res?.data?.total ?? (Array.isArray(rooms) ? rooms.length : 0);
      return { rooms, total };
    },
  });
}

export function useRoom(id?: string) {
  return useQuery({
    queryKey: ROOM_KEYS.detail(String(id)),
    queryFn: async () => {
      if (!id) return null;
      const res: any = await apiGet(`/rooms/${id}`);
      return res.data?.room || res.room || res;
    },
    enabled: !!id,
  });
}

export function useCreateRoom() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (body: CreateRoomInput) => apiPost(`/rooms`, body),
    onSuccess: () => qc.invalidateQueries({ queryKey: ROOM_KEYS.all }),
  });
}

export function useUpdateRoom() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, body }: { id: string; body: UpdateRoomInput }) =>
      apiPut(`/rooms/${id}`, body),
    onSuccess: (_data, { id }) => {
      qc.invalidateQueries({ queryKey: ROOM_KEYS.all });
      qc.invalidateQueries({ queryKey: ROOM_KEYS.detail(id) });
    },
  });
}

export function useDeleteRoom() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => apiDelete(`/rooms/${id}`),
    onMutate: async (id: string) => {
      await qc.cancelQueries({ queryKey: ROOM_KEYS.all });
      const previous = qc.getQueryData(ROOM_KEYS.all as any);
      qc.setQueryData(ROOM_KEYS.all as any, (old: any) =>
        (old || []).filter((r: any) => r.id !== id)
      );
      return { previous };
    },
    onError: (_err, _id, context: any) =>
      qc.setQueryData(ROOM_KEYS.all as any, context.previous),
    onSettled: () => qc.invalidateQueries({ queryKey: ROOM_KEYS.all }),
  });
}
