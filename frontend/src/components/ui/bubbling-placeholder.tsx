import React from "react";
import { Skeleton } from "@/components/ui/skeleton";

type Variant =
  | "page"
  | "header"
  | "stats"
  | "cardList"
  | "list"
  | "form"
  | "small";

interface Props {
  variant?: Variant;
  count?: number;
}

export default function BubblingPlaceholder({
  variant = "page",
  count = 3,
}: Props) {
  if (variant === "small") {
    return (
      <div className="space-y-2">
        <Skeleton className="h-4 w-32 rounded-xl" />
      </div>
    );
  }

  if (variant === "header") {
    return (
      <div className="space-y-4 p-6">
        <Skeleton className="h-10 w-3/5 rounded-2xl" />
        <Skeleton className="h-6 w-1/3 rounded-xl" />
      </div>
    );
  }

  if (variant === "stats") {
    return (
      <div className="grid gap-6 md:grid-cols-4 p-6">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="space-y-3">
            <Skeleton className="h-6 w-32 rounded-xl" />
            <Skeleton className="h-10 w-full rounded-2xl" />
            <Skeleton className="h-3 w-3/5 rounded-xl" />
          </div>
        ))}
      </div>
    );
  }

  if (variant === "cardList" || variant === "list") {
    return (
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 p-6">
        {Array.from({ length: count }).map((_, i) => (
          <div key={i} className="space-y-3">
            <Skeleton className="h-6 w-1/2 rounded-xl" />
            <Skeleton className="h-40 w-full rounded-2xl" />
          </div>
        ))}
      </div>
    );
  }

  if (variant === "form") {
    return (
      <div className="space-y-4 p-6">
        <Skeleton className="h-6 w-1/3 rounded-xl" />
        <Skeleton className="h-10 w-full rounded-xl" />
        <Skeleton className="h-10 w-full rounded-xl" />
        <Skeleton className="h-40 w-full rounded-2xl" />
        <div className="flex gap-3">
          <Skeleton className="h-10 w-32 rounded-xl" />
          <Skeleton className="h-10 w-32 rounded-xl" />
        </div>
      </div>
    );
  }

  // default page placeholder
  return (
    <div className="space-y-6 p-6">
      <div className="space-y-4">
        <Skeleton className="h-10 w-3/5 rounded-2xl" />
        <Skeleton className="h-6 w-1/3 rounded-xl" />
      </div>
      <div>
        <div className="mb-4">
          <Skeleton className="h-6 w-1/4 rounded-xl" />
        </div>
        <div className="grid gap-6 md:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-24 w-full rounded-2xl" />
          ))}
        </div>
      </div>
      <div>
        <Skeleton className="h-8 w-1/4 rounded-xl" />
        <div className="mt-4 grid gap-6 md:grid-cols-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-40 w-full rounded-2xl" />
          ))}
        </div>
      </div>
    </div>
  );
}

export { BubblingPlaceholder };
