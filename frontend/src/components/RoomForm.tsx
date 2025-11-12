import React from "react";
import { useForm, Controller } from "react-hook-form";
import { useQuery } from "@tanstack/react-query";
import type { Room, CreateRoomInput, RoomType } from "@/types/rooms";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { apiGet } from "@/lib/api";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";

interface Props {
  initialValues?: Partial<Room> | null;
  onSubmit: (data: CreateRoomInput) => Promise<void> | void;
  onCancel?: () => void;
}

export default function RoomForm({ initialValues, onSubmit, onCancel }: Props) {
  type FormValues = Partial<CreateRoomInput> & { images?: string | string[] };

  const { control, register, handleSubmit, formState } = useForm<FormValues>({
    defaultValues: initialValues || {
      room_number: "",
      base_price_birr: 0,
      status: "vacant",
      room_type_id: undefined,
    },
  });

  // Fetch room types for the select dropdown
  const roomTypesQ = useQuery({
    queryKey: ["room_types"],
    queryFn: async () => {
      const res = await apiGet<{
        success: true;
        data: { room_types: RoomType[] };
      }>(`/room_types`);
      // backend returns { success: true, data: { room_types: [...] } }
      return res?.data?.room_types || [];
    },
    staleTime: 1000 * 60 * 5,
  });
  const { toast } = useToast();

  const submit = async (data: Partial<CreateRoomInput>) => {
    // Basic runtime validation
    if (!data.room_number)
      return toast({
        title: "Validation",
        description: "Room number is required",
        variant: "destructive",
      });
    if (data.base_price_birr == null)
      return toast({
        title: "Validation",
        description: "Price is required",
        variant: "destructive",
      });
    // support comma-separated images in the optional description field
    const payload: CreateRoomInput = {
      ...data,
      images:
        data.images && typeof data.images === "string"
          ? data.images
              .split(",")
              .map((s) => s.trim())
              .filter(Boolean)
          : Array.isArray(data.images)
          ? data.images
          : undefined,
    } as CreateRoomInput;

    await onSubmit(payload);
  };

  return (
    <form onSubmit={handleSubmit(submit)} className="space-y-4">
      <div>
        <label className="block text-sm font-medium">Room number</label>
        <input
          {...register("room_number")}
          className="mt-1 block w-full rounded-md border p-2"
          placeholder="e.g. 101"
        />
      </div>

      <div>
        <label className="block text-sm font-medium">Room type</label>
        <Controller
          control={control}
          name="room_type_id"
          render={({ field }) => (
            <Select
              value={field.value || ""}
              onValueChange={(v) => field.onChange(v || undefined)}
            >
              <SelectTrigger className="mt-1 w-full">
                <SelectValue placeholder="Select room type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">None</SelectItem>
                {roomTypesQ.data?.map((rt: RoomType) => (
                  <SelectItem key={rt.id} value={rt.id}>
                    {rt.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        />
      </div>

      <div className="grid grid-cols-3 gap-3">
        <div>
          <label className="block text-sm font-medium">Floor</label>
          <input
            type="number"
            {...register("floor", { valueAsNumber: true })}
            className="mt-1 block w-full rounded-md border p-2"
          />
        </div>
        <div>
          <label className="block text-sm font-medium">Capacity</label>
          <input
            type="number"
            {...register("capacity", { valueAsNumber: true })}
            className="mt-1 block w-full rounded-md border p-2"
          />
        </div>
        <div>
          <label className="block text-sm font-medium">Price (ETB)</label>
          <input
            type="number"
            {...register("base_price_birr", { valueAsNumber: true })}
            className="mt-1 block w-full rounded-md border p-2"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium">Status</label>
        <select
          {...register("status")}
          className="mt-1 block w-full rounded-md border p-2"
        >
          <option value="vacant">Vacant</option>
          <option value="occupied">Occupied</option>
          <option value="cleaning">Cleaning</option>
          <option value="maintenance">Maintenance</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium">View type</label>
        <input
          {...register("view_type")}
          className="mt-1 block w-full rounded-md border p-2"
        />
      </div>

      <div>
        <label className="block text-sm font-medium">Description</label>
        <textarea
          {...register("description")}
          className="mt-1 block w-full rounded-md border p-2"
          rows={3}
        />
      </div>

      <div className="flex items-center gap-3">
        <Button type="submit" disabled={formState.isSubmitting}>
          {formState.isSubmitting ? "Saving..." : "Save"}
        </Button>
        <Button variant="ghost" type="button" onClick={onCancel}>
          Cancel
        </Button>
      </div>
    </form>
  );
}
