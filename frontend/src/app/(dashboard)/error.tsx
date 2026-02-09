"use client";
import { Button } from "@/components/ui/button";
export default function Error({ reset }: { reset: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center h-[50vh] gap-4">
      <h2 className="text-xl font-semibold">Backend is not responding</h2>
      <p className="text-muted-foreground">
        Check if the backend server is running and try again.
      </p>
      <Button onClick={() => reset()}>Try Again</Button>
    </div>
  );
}
