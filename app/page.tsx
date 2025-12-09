import { RoomCreate } from "@/components/room-create";
import { Suspense } from "react";

export default function HomePage() {
  return (
    <main className="flex min-h-screen flex-col justify-center items-center">
      <Suspense>
        <RoomCreate />
      </Suspense>
    </main>
  );
}
