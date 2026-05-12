import { Skeleton } from "@/components/ui/skeleton";

interface LoadingStateProps {
  variant?: "card" | "page" | "tool";
}

export function LoadingState({ variant = "card" }: LoadingStateProps) {
  if (variant === "page") {
    return (
      <div className="container mx-auto px-4 py-12 max-w-4xl space-y-8">
        <div className="flex flex-col items-center gap-4">
          <Skeleton className="h-14 w-14 rounded-2xl" />
          <Skeleton className="h-8 w-64" />
          <Skeleton className="h-4 w-96" />
        </div>
        <Skeleton className="h-64 w-full rounded-2xl" />
      </div>
    );
  }

  if (variant === "tool") {
    return (
      <div className="space-y-4">
        <Skeleton className="h-10 w-full rounded-xl" />
        <Skeleton className="h-48 w-full rounded-xl" />
        <Skeleton className="h-10 w-40 rounded-xl" />
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-border/40 p-5 space-y-3">
      <Skeleton className="h-10 w-10 rounded-xl" />
      <Skeleton className="h-5 w-3/4" />
      <Skeleton className="h-4 w-full" />
    </div>
  );
}